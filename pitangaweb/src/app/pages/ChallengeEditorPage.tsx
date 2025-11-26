// React e libs externas
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftFromLineIcon, ChevronDownIcon } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

import type { Challenge } from '@/types/challenges.types';
import type { ValidationResult } from '@/types/validations.type';

import { cn } from '@/lib/utils';
import { debounce } from '@/infra/utils/debounce';
import { saveSolution } from '@/infra/data/challenges.rest';

import { useAuth } from '@/hooks/useAuth';
import { useActionDialog } from '@/app/hooks/useActionDialog';
import { useChallengeSolution } from '@/app/hooks/useChallengeSolution';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CodeEditor } from '@/app/components/CodeEditor';
import { ActionDialog } from '@/app/components/ActionDialog';
import { PageContainer } from '@/app/components/PageContainer';
import { ValidationItem } from '@/app/components/ValidationItem';
import { DifficultyLevelBadge } from '@/app/components/DifficultyLevelBadge';

type ChallengeEditorStatus = 'idle' | 'saving' | 'running' | 'error';

function getDefaultValidationResults(validations?: Challenge['validations']): ValidationResult[] {
  if (!validations) return [];

  return validations.map(({ testInput, ...rest })=> ({
    ...rest,
    input: testInput,
    output: '',
    status: null,
  }));
}

export const ChallengeEditorPage = () => {
  const [code, setCode] = useState<string>();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [status, setStatus] = useState<ChallengeEditorStatus>('idle');

  const { challengeId } = useParams<string>();

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const readOnly = !isAuthenticated;

  if (!challengeId) {
    throw new Error("Missing challenge id in route parameters.");
  }

  const {
    challenge,
    solution,
    challengeSolutionIsFetchedAfterMount,
  } = useChallengeSolution(challengeId);

  useEffect(() => {
    if (!challenge) return;

    if (readOnly) {
      setCode(challenge.baseCode);
      return;
    }

    const code = solution?.code ?? challenge.baseCode;
    setCode(code);

  }, [challenge, solution, readOnly]);

  const {
    open,
    setOpen,
    config,
    showDialog,
    handleConfirm,
  } = useActionDialog();

  const saveAndRunCode = useCallback(async (newCode: string) => {
    if (readOnly) return;

    setStatus('saving');

    try {
      const savedSolution = await saveSolution({
        language: 'java',
        code: newCode,
        challengeId,
      });

      const previousChallengeSolution = queryClient.getQueryData(['challenge-solution', challengeId]);
      if (previousChallengeSolution) {
        const nextChallengeSolution = {
          ...previousChallengeSolution,
          solution: {
            code: savedSolution?.code,
          }
        }

        await queryClient.setQueryData(['challenge-solution', challengeId], nextChallengeSolution);
      }

      queryClient.invalidateQueries({
        exact: true,
        queryKey: ['challenge-solution', challengeId]
      });
    } catch {
      setStatus('error');
    } finally {
      setStatus('idle');
    }
  }, [challengeId, readOnly]);

  const debouncedSave = useMemo(
    () => debounce(saveAndRunCode, 3000),
    [saveAndRunCode]
  );

  useEffect(() => {
    return () => {
      if (readOnly) return;
      debouncedSave.flush();
    };
  }, [debouncedSave, readOnly]);

  const handleCodeChange = useCallback((newCode: string) => {
    if (readOnly) return;

    setCode(newCode);
    debouncedSave(newCode);
  }, [debouncedSave]);

  const handleRestoreChallengeBaseCode = () => {
    if (readOnly) return;

    showDialog({
      title: 'Restaurar código base do desafio?',
      description: `Esta ação não poderá ser revertida.
        As alterações feitas podem ser perdidas.`,
      confirmLabel: 'Restaurar',
      variant: 'destructive',
      action: () => {
        setCode(challenge?.baseCode);
      },
    });
  };

  const displayedTests = useMemo(() => (
    solution?.validationResults ??
    getDefaultValidationResults(challenge?.validations)
  ), [solution, challenge?.validations]);

  const buttonLabel: Record<ChallengeEditorStatus, string> = {
    idle: 'Salvar e executar',
    running: 'Executando...',
    saving: 'Salvando...',
    error: 'Erro ao salvar ou executar o código',
  };

  if (!challenge) {
    return (
      <span>Desafio não carregado!</span>
    )
  }

  return (
    <PageContainer className="space-y-5 flex flex-col min-h[100vh]">
      <div className="flex gap-2">
        <Button
          className={cn(
            'h-auto',
            readOnly && 'cursor-not-allowed'
          )}
          disabled={readOnly}
          onClick={() => navigate('/')}
        >
          <ArrowLeftFromLineIcon />
        </Button>

        <Card className="w-full">
          <CardHeader className="flex flex-row justify-between items-center space-y-0">
            <CardTitle className="text-lg">
              {challenge.title}
            </CardTitle>
            <DifficultyLevelBadge level={challenge.level} />
          </CardHeader>
        </Card>
      </div>

      {challenge.description && (
        <Collapsible>
          <CollapsibleTrigger
            className="
              pr-2
              group w-full
              cursor-pointer
              focus-visible:outline-none
              text-md text-left font-medium
              flex justify-between items-center
            "
          >
            Descrição do desafio
            <ChevronDownIcon
              className="
                w-5 h-5
                transition-transform duration-200 ease-in-out
                group-data-[state=open]:rotate-180
              "
            />
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div
              className="revert-all"
              dangerouslySetInnerHTML={{
                __html: challenge.description,
              }}
            />
          </CollapsibleContent>

          <Separator className="mt-3" />
        </Collapsible>
      )}

      <div className='flex justify-between items-center gap-2'>
        <h3 className='text-md font-medium'>Editor de código</h3>
        <Button
          variant="ghost"
          disabled={
            readOnly ||
            code === challenge.baseCode
          }
          className={cn(
            readOnly && 'cursor-not-allowed'
          )}
          onClick={handleRestoreChallengeBaseCode}
        >
          Restaurar código base
        </Button>
      </div>
      {!challengeSolutionIsFetchedAfterMount ? (
        <span>Carregando editor...</span>
      ) : (
        <CodeEditor
          value={code}
          readOnly={readOnly}
          onChange={handleCodeChange}
        />
      )}

      <div className='flex justify-between items-center gap-4'>
        <Button onClick={() => setOpenDrawer(true)}>
          Validações
        </Button>

        <Button
          className={cn(
            'w-full max-w-sm',
            readOnly && 'cursor-not-allowed'
          )}
          disabled={
            readOnly ||
            status !== 'idle'
          }
          onClick={async () => {
            if (!code) return;
            await saveAndRunCode(code);
            setOpenDrawer(true);
          }}
        >
          {readOnly ? 'Somente visualização' : buttonLabel[status]}
        </Button>
      </div>

      <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
        <DrawerContent>
          <div className="p-3 sm:p-6 md:p-10 mx-auto w-full max-w-7xl">
            <DrawerHeader className="p-0 mb-4">
              <DrawerTitle>Validações</DrawerTitle>
              <DrawerDescription>Entradas e saídas de dados esperadas</DrawerDescription>
            </DrawerHeader>

            <div className="pb-0 max-h-[520px]">
              <ScrollArea className="h-full flex flex-1">
                <div className="pr-3 flex flex-col gap-4">
                  {displayedTests.map((test, index) => (
                    <ValidationItem
                      key={index}
                      {...test}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <ActionDialog
        open={open}
        onOpenChange={setOpen}
        title={config.title}
        description={config.description}
        confirmLabel={config.confirmLabel}
        variant={config.variant}
        onConfirm={handleConfirm}
      />
    </PageContainer>
  );
};

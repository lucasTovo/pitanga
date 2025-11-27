// React e libs externas
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftFromLineIcon, ChevronDownIcon, EyeOffIcon, LogInIcon, Share2Icon } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

import type { Challenge } from '@/types/challenges.types';
import type { ValidationResult } from '@/types/validations.type';

import { cn } from '@/lib/utils';
import { debounce } from '@/infra/utils/debounce';
import { copyChallenge, saveSolution } from '@/infra/data/challenges.rest';

import { useAuth } from '@/hooks/useAuth';
import { useActionDialog } from '@/app/hooks/useActionDialog';
import { useChallengeSolution } from '@/app/hooks/useChallengeSolution';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { CodeEditor } from '@/app/components/CodeEditor';
import { ActionDialog } from '@/app/components/ActionDialog';
import { PageContainer } from '@/app/components/PageContainer';
import { ValidationItem } from '@/app/components/ValidationItem';
import { DifficultyLevelBadge } from '@/app/components/DifficultyLevelBadge';
import { ShareChallengeDialog } from '@/app/components/ShareChallengeDialog';

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

interface Props {
  readOnly?: boolean;
}

export const ChallengeEditorPage = ({ readOnly = false }: Props) => {
  const [code, setCode] = useState<string>();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [status, setStatus] = useState<ChallengeEditorStatus>('idle');

  const { challengeId } = useParams<string>();

  const navigate = useNavigate();
  const { userId, isAuthenticated, login } = useAuth();
  const queryClient = useQueryClient();

  const isInteractionDisabled = readOnly || !isAuthenticated;

  if (!challengeId) {
    throw new Error("Missing challenge id in route parameters.");
  }

  const {
    challenge,
    solution,
    challengeSolutionIsFetchedAfterMount,
  } = useChallengeSolution(challengeId);

  const isChallengeFromAnotherUser =
    isAuthenticated &&
    challenge?.creatorId !== userId;

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
    if (isInteractionDisabled ) return;

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
  }, [challengeId, isInteractionDisabled]);

  const debouncedSave = useMemo(
    () => debounce(saveAndRunCode, 3000),
    [saveAndRunCode]
  );

  useEffect(() => {
    return () => {
      if (isInteractionDisabled ) return;
      debouncedSave.flush();
    };
  }, [debouncedSave, isInteractionDisabled ]);

  const handleCodeChange = useCallback((newCode: string) => {
    if (isInteractionDisabled) return;

    setCode(newCode);
    debouncedSave(newCode);
  }, [debouncedSave]);

  const handleRestoreChallengeBaseCode = () => {
    if (isInteractionDisabled ) return;

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

  const displayedTests = useMemo(() => {
    if (readOnly) {
      return getDefaultValidationResults(challenge?.validations);
    }

    return solution?.validationResults ??
          getDefaultValidationResults(challenge?.validations);
  }, [readOnly, solution, challenge?.validations]);

  const isButtonDisabled =
    (isInteractionDisabled && !isChallengeFromAnotherUser)
      || status !== 'idle'

  const buttonStatusLabel: Record<ChallengeEditorStatus, string> = {
    idle: 'Salvar e executar',
    running: 'Executando...',
    saving: 'Salvando...',
    error: 'Erro ao salvar ou executar o código',
  };

  const buttonLabel = () => {
    return isButtonDisabled
      ? 'Somente visualização'
      : isChallengeFromAnotherUser
        ? 'Usar desafio'
        : buttonStatusLabel[status];
  }


  const handleMainButtonClick = async () => {
    if (!code) return;

    if (isChallengeFromAnotherUser) {
      await handleCopyChallenge(challengeId);
      return;
    }

    if (isInteractionDisabled) return;

    await saveAndRunCode(code);
    setOpenDrawer(true);
  };

  const handleCopyChallenge = async (id: string) => {
    showDialog({
      title: 'Usar desafio?',
      description: 'O desafio deve ser copiado e adicionado aos seus desafios para poder usá-lo.',
      confirmLabel: 'Copiar',
      variant: 'default',
      action: async () => {
        const response = await copyChallenge(id);
        queryClient.invalidateQueries({ queryKey: ['my-challenges'] });
        navigate(`/challenges/${response.id}`);
      }
    });
  }

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
            !isAuthenticated && 'cursor-not-allowed'
          )}
          disabled={!isAuthenticated}
          onClick={() => navigate('/')}
        >
          <ArrowLeftFromLineIcon />
        </Button>

        <Card className="w-full flex justify-between min-w-0">
          <CardHeader className="p-4 sm:p-6 flex flex-1 items-start gap-2 space-y-0 min-w-0">
            <div className='w-full flex justify-between items-start'>
              <DifficultyLevelBadge level={challenge.level} />
              <TooltipProvider>
                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    {(challenge.isPublic) ? (
                      <ShareChallengeDialog challengeId={challenge.id}>
                        <Button variant="secondary" size="icon">
                          <Share2Icon />
                        </Button>
                      </ShareChallengeDialog>
                    ) : (
                      <Button
                        size='icon'
                        className="bg-muted text-muted-foreground hover:bg-muted cursor-default"
                        aria-disabled
                      >
                        <EyeOffIcon />
                      </Button>
                    )}
                  </TooltipTrigger>
                  <TooltipContent className="bg-muted text-muted-foreground">
                    {(challenge.isPublic) ? (
                      <p>Compartilhar desafio</p>
                    ) : (
                      <p>Desafio privado</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <CardTitle className="text-md sm:text-lg line-clamp-3 w-full">
              {challenge.title}
            </CardTitle>
          </CardHeader>
          {!isAuthenticated && (
            <div className='p-4 sm:p-6  flex gap-4 items-center border-l shrink-0'>
              <Button
                onClick={() => login()}
              >
                Entrar
                <LogInIcon />
              </Button>
            </div>
          )}
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
            isInteractionDisabled  ||
            code === challenge.baseCode
          }
          className={cn(
            isInteractionDisabled  && 'cursor-not-allowed'
          )}
          onClick={handleRestoreChallengeBaseCode}
        >
          Restaurar código base
        </Button>
      </div>
      {!challengeSolutionIsFetchedAfterMount ? (
        <div className='grow'>
          <span>Carregando editor código...</span>
        </div>
      ) : (
        <CodeEditor
          value={code}
          readOnly={isInteractionDisabled}
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
            isButtonDisabled  && 'cursor-not-allowed'
          )}
          disabled={isButtonDisabled}
          onClick={async () => handleMainButtonClick()}
        >
          {buttonLabel()}
        </Button>
      </div>

      <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
        <DrawerContent>
          <div className="p-3 sm:p-6 md:p-10 mx-auto w-full max-w-7xl">
            <DrawerHeader className="p-0 mb-4">
              <DrawerTitle>Validações</DrawerTitle>
              <DrawerDescription>
                {challenge.validations.length
                  ? 'Entradas e saídas de dados esperadas'
                  : 'O desafio não possui validações adicionadas'
                }
              </DrawerDescription>
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

import { useCallback, useMemo, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { ArrowLeftFromLineIcon, ChevronDownIcon } from 'lucide-react';

import type { Solution } from '@/types/solutions.types';
import type { Challenge } from '@/types/challenges.types';
import type { ValidationResult } from '@/types/validations.type';

import { debounce } from '@/infra/utils/debounce';
import { saveSolution } from '@/infra/data/challenges.rest';

import { useActionDialog } from '@/app/hooks/useActionDialog';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CodeEditor } from '@/app/components/CodeEditor';
import { ActionDialog } from '@/app/components/ActionDialog';
import { ValidationItem } from '@/app/components/ValidationItem';
import { DifficultyLevelBadge } from '@/app/components/DifficultyLevelBadge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

type ChallengeEditorStatus = 'idle' | 'saving' | 'running' | 'error';

function getDefaultValidationResults(validations: Challenge['validations']): ValidationResult[] {
  return validations.map(({ testInput, ...rest })=> ({
    ...rest,
    input: testInput,
    output: '',
    status: null,
  }));
}

export const ChallengeEditorPage = () => {
  const data = useLoaderData() as {
    challenge: Challenge;
    solution?: Solution;
  };
  const [code, setCode] = useState(data.solution?.code ?? data.challenge.baseCode);
  const [status, setStatus] = useState<ChallengeEditorStatus>('idle');
  const [solution, setSolution] = useState(data.solution);
  const [openDrawer, setOpenDrawer] = useState(false)

  const navigate = useNavigate();

  const {
    open,
    setOpen,
    config,
    showDialog,
    handleConfirm
  } = useActionDialog();


  const saveCode = useCallback(async (newCode: string) => {
    try {
      const savedSolution = await saveSolution({
        language: 'java',
        code: newCode,
        challengeId: data.challenge.id,
      });

      setSolution(savedSolution);
    } catch (err) {
      setStatus('error');
    } finally {
      setStatus('idle');
    }
  }, [data.challenge.id]);

  const debouncedSave = useMemo(() => debounce(saveCode, 3000), []);

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    setStatus('saving');
    debouncedSave(newCode);
  }, [debouncedSave]);

  const runCode = useCallback(async () => {
    setStatus('running');

    try {
      const result = await saveSolution({
        language: 'java',
        code,
        challengeId: data.challenge.id,
      });

      setSolution(result);
    } catch {
      setStatus('error');
    } finally {
      setStatus('idle');
    }
  }, [data.challenge.id, code]);

  const handleRestoreChallengeBaseCode = () => {
    showDialog({
      title: 'Restaurar código base do desafio?',
      description: `Esta ação não poderá ser revertida.
        As alterações feitas podem ser perdidas.`,
      confirmLabel: 'Restaurar',
      variant: 'destructive',
      action: () => {
        setCode(data.challenge.baseCode);
      },
    });
  }

  const displayedTests = useMemo(() => (
    solution?.validationResults ?? getDefaultValidationResults(data.challenge.validations)
  ), [solution, data.challenge.validations]);

  const buttonLabel: Record<ChallengeEditorStatus, string> = {
    idle: 'Salvar e executar',
    running: 'Executando...',
    saving: 'Salvando...',
    error: 'Erro ao salvar ou executar o codigo',
  }

  return (
    <div className="space-y-5 flex flex-col h-full">
      <div className='flex gap-2'>
        <Button
          className='h-auto'
          onClick={() => navigate('/')}
        >
          <ArrowLeftFromLineIcon/>
        </Button>

        <Card className="w-full">
          <CardHeader className="flex flex-row justify-between items-center space-y-0">
            <CardTitle className='text-lg'>{data.challenge.title}</CardTitle>
            <DifficultyLevelBadge level={data.challenge.level} />
          </CardHeader>
        </Card>
      </div>

      {data.challenge.description &&
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
              dangerouslySetInnerHTML={{ __html: data.challenge.description }}
            />
          </CollapsibleContent>
          <Separator className='mt-3' />
        </Collapsible>
      }

      <h3 className='text-md font-medium'>Editor de código</h3>
      <CodeEditor value={code} onChange={handleCodeChange} />

      <div className='flex justify-between gap-2'>
        <Button
          variant="ghost"
          disabled={code === data.challenge.baseCode}
          onClick={handleRestoreChallengeBaseCode}
        >
          Restaurar código base
        </Button>

        <Button
          className="w-full max-w-sm self-center"
          disabled={status !== 'idle'}
          onClick={() => setOpenDrawer(true)}
        >
          {buttonLabel[status]}
        </Button>
      </div>

      <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
        <DrawerContent>
          <div className="p-3 sm:p-6 md:p-10 mx-auto w-full max-w-7xl">
            <DrawerHeader className='p-0 mb-4'>
              <DrawerTitle>Validações</DrawerTitle>
            </DrawerHeader>
            <div className="pb-0 h-[520px]">
              <ScrollArea className='h-full flex flex-1'>
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
    </div>
  )
}

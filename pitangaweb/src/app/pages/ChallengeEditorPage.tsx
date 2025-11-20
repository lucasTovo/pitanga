import { useCallback, useMemo, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { ArrowLeftFromLineIcon } from 'lucide-react';

import type { Solution } from '@/types/solutions.types';
import type { Challenge } from '@/types/challenges.types';
import type { ValidationResult } from '@/types/validations.type';

import { debounce } from '@/infra/utils/debounce';
import { saveSolution } from '@/infra/data/challenges.rest';

import { useActionDialog } from '@/app/hooks/useActionDialog';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { CodeEditor } from '@/app/components/CodeEditor';
import { ActionDialog } from '@/app/components/ActionDialog';
import { ValidationItem } from '@/app/components/ValidationItem';
import { DifficultyLevelBadge } from '@/app/components/DifficultyLevelBadge';

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

      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className='text-md'>Descrição do desafio</AccordionTrigger>
          <AccordionContent>
            <div className="revert-all" dangerouslySetInnerHTML={{ __html: data.challenge.description }} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <h3 className='text-md font-medium'>Editor de código</h3>
      <CodeEditor value={code} onChange={handleCodeChange} />

      <div className='flex justify-between gap-2'>
        <Button
          variant="outline"
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
          <div className="mx-auto w-full max-w-7xl">
            <DrawerHeader>
              <DrawerTitle>Validações</DrawerTitle>
            </DrawerHeader>
            <div className="p-4 pb-0">
              <div className="flex flex-col gap-4 h-[420px]">
                {displayedTests.map((r, i) => (
                  <ValidationItem
                    key={i}
                    {...r}
                  />
                ))}
              </div>
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

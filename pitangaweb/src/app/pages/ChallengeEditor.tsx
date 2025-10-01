import { useEffect, useMemo, useRef, useState } from 'react';
import { useLoaderData } from 'react-router-dom';

import { Solution } from '@/types/solutions.types';
import { Challenge } from '@/types/challenges.types';
import { ValidationResult } from '@/types/validations.type';

import { saveSolution } from '../../infra/data/challenges.rest';
import { debounce } from '../../infra/utils/debounce';

import { ToolTray } from '../components/tool-tray';
import { Editor } from '../components/editor/editor';
import { ValidationContainer } from '../components/validation';
import { DescriptionModal } from '../components/description-modal';
import { EditorConfigContext, defaultEditorConfig } from '../components/editor/editor-config.context';

export const ChallengeEditor = () => {
  const { challenge, solution: currentSolution } = useLoaderData() as {
    challenge: Challenge,
    solution?: Solution
  };
  const [isSaving, setIsSaving] = useState(false);
  const [solution, setSolution] = useState(currentSolution);
  const [code, setCode] = useState(solution?.code ?? challenge.baseCode);
  const [viewDescription, setViewDescription] = useState(false);

  const executeCode = (code: string) => {
    setIsSaving(true);
    const request = {
      language: 'java',
      code,
      challengeId: challenge.id
    };
    saveSolution(request).then(sol => {
      setSolution(sol);
      setIsSaving(false);
    });
  };

  const executeCodeListener = useRef(debounce(executeCode));

  useEffect(() => {
    document.title = 'Pitanga | ' + challenge.title;
  }, [challenge]);

  const persistCode = async (code: string) => {
    setCode(code);
    setIsSaving(true);
    executeCodeListener.current(code);
  };

  // useMemo para não recalcular toda hora
  const displayedTests: ValidationResult[] = useMemo(() => {
    return solution?.validationResults
      ?? challenge.validations.map(v => ({
        ...v,
        output: '',
        status: null
      }));
  }, [solution, challenge.validations]);

  return (
    <>
      <ToolTray
        title={challenge.title}
        onClickViewDoc={() => setViewDescription(!viewDescription)}
        solutionCodeChanged={code !== solution?.code}
      />
      <DescriptionModal
        show={viewDescription}
        onClose={() => setViewDescription(false)}
        title={challenge.title}
        description={challenge.description}
      />
      <EditorConfigContext.Provider value={defaultEditorConfig}>
        <Editor customContent={code} onChangeCode={persistCode} />
        <ValidationContainer
          isSaving={isSaving}
          solutionChanged={code !== solution?.code}
          saveCode={() => executeCode(code)}
          results={displayedTests}
        />
      </EditorConfigContext.Provider>
    </>
  );
};

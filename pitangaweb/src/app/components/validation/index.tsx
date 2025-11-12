import { useState } from 'react';

import { ValidationResult } from '@/types/validations.type';

import './style.css';

import { ValidationItem } from './validation-item';
import { SaveButton } from './SaveButton';
import { ShowVallidationsButton } from './show-validations-button';

type Props = {
  saveCode: () => void;
  isSaving: boolean;
  solutionChanged: boolean;
  results?: ValidationResult[];
};

export const ValidationContainer = (props: Props) => {
  const [show, setShow] = useState(true);
  return (
    <div className={'validation-container ' + (show ? 'bottom-0' : '-bottom-80') }>
      <div className='flex justify-between'>
        <ShowVallidationsButton onClick={() => setShow(!show)} show={show} />
        <SaveButton
          isSaving={props.isSaving}
          saveCode={props.saveCode}
          shouldSave={props.solutionChanged}
        />
      </div>
      <ol>
        <li className='py-2 text-center font-bold'><h3>Testes</h3></li>
        {props.results?.map((test, i) => (
          <ValidationItem key={i} {...test} />
        ))}
      </ol>
    </div>
  );
};

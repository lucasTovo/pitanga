import { useState } from 'react';
import { ValidationResult, ValidationStatus } from '@/types/validations.type';

const NULL_STYLE = 'border-gray-800 bg-gray-500 text-white';
const FAIL_STYLE = 'border-red-800 bg-red-500 text-white';
const SUCCESS_STYLE = 'border-lime-800 bg-lime-500 text-lime-50';

const getStyle = (status: ValidationStatus | null) => {
  return new Map<ValidationStatus | null, string>([
    [null, NULL_STYLE],
    [ValidationStatus.FAIL, FAIL_STYLE],
    [ValidationStatus.PASS, SUCCESS_STYLE]
  ]).get(status);
};

export const ValidationItem = (props: ValidationResult) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li
      onClick={() => setIsOpen(!isOpen)}
      className={'border rounded p-1 ' + getStyle(props.status)}
    >
      <div className="grid grid-cols-6 pb-1">
        <div className="col-span-5">
          <p>Input: {props.testInput?.trim()?.length > 0 ? props.testInput : 'Sem input'}</p>
          <p className='font-black'>Output esperado: {props.expectedOutput}</p>
        </div>
      </div>
      <p hidden={isOpen} className="border border-gray-700 bg-gray-700 rounded-sm p-2">
        {props.output}
      </p>
    </li>
  );
};

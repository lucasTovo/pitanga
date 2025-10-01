import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { default as Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { saveChallenge } from '../../infra/data/challenges.rest';
import { defaultEditorConfig } from '../components/editor/editor-config.context';
import { ValidationFormField, validationFactory } from '../../infra/utils/validation-factory';

import { ChallengeEditor } from '../components/editor/challenge-editor';
import { ValidationEditor } from '../components/validation/validation-editor';


export const CreateChallenge = () => {
  const navigate = useNavigate();
  const [baseCode, setBaseCode] = useState(defaultEditorConfig.fileContent);
  const [description, setDescription] = useState('');

  useEffect(() => {
    document.title = 'Pitanga | Criar desafio';
  }, []);

  const onSubmitForm = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const elements = event.currentTarget.elements as unknown as {
      title: HTMLInputElement;
      level: HTMLSelectElement;
    } & ValidationFormField;

    const validations = validationFactory(elements);

    const body = {
      title: elements.title.value,
      baseCode,
      description,
      level: elements.level.value,
      validations: validations
    };

    saveChallenge(body)
      .then((res) => {
        navigate('/challenges/' + res.id);
      });
  }, [description, baseCode, navigate]);

  return (
    <div className='max-w-2xl mx-auto'>
      <nav className="w-full p-2">
        <div className="grid grid-cols-6">
          <Link
            to={'/'}
            className="col-span-1 flex p-2 text-cyan-500 text-center gap-1">
            <img className='h-5 w-full' src='/pitanga-tcc/back.svg' alt='voltar' />
          </Link>
          <h2 className='col-span-5 text-xl font-bold text-ellipsis overflow-hidden'>
            Criar desafio
          </h2>
        </div>
      </nav>
      <form id='challenge' className='p-3 space-y-3' onSubmit={onSubmitForm}>
        <input
          className='p-2 rounded-md text-lg border border-slate-800 w-full'
          type="text"
          name="title"
          id="title"
          placeholder='Titulo'
          aria-label='Titulo do desafio'
          required
          minLength={5}
        />
        <h3 className='p-2 text-lg font-bold'>Descrição</h3>
        <Quill
          placeholder='Descrição'
          theme='snow'
          value={description}
          onChange={setDescription}
        />
        <div className='flex'>
          <h3 className='p-2 text-lg font-bold'>Nível: </h3>
          <select name="level" id="level">
            <option value="EASY">Fácil</option>
            <option value="MEDIUM">Médio</option>
            <option value="HARD">Dificil</option>
            <option value="PRO">PRO</option>
          </select>
        </div>
        <ValidationEditor />
        <ChallengeEditor baseCode={baseCode} setBaseCode={setBaseCode} />
        <div className='space-x-2 flex justify-end pb-16'>
          <button
            className='border rounded border-rose-800 p-3 bg-rose-500 text-white'
            type='submit'>Enviar</button>
        </div>
      </form>
    </div>
  );
};

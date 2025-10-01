import { useEffect, useState } from 'react';
import { useRouteError } from 'react-router-dom';
import { AxiosError } from 'axios';

import { ErrorCodeMap } from '../../infra/error/error-code.map';

export const ErrorPage = () => {
  const error = useRouteError();
  const mapper = new ErrorCodeMap();
  const [message, setMessage] = useState('Desculpe, ocorreu um erro inesperado.');

  useEffect(() => {
    console.error(error);
    if (error instanceof AxiosError) {
      setMessage(mapper.fromAxiosError(error));
    }
    document.title = 'Pitanga | ' + message;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return (
    <div className="max-w-sm mx-auto space-y-3 h-screen flex flex-col justify-center">
      <h1 className="text-center text-4xl font-bold">Oops!</h1>
      <p className="text-center">{message}</p>
      <p className="text-center text-gray-500">{(error as { message: string }).message}</p>
    </div>
  );
};

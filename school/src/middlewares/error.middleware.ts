import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);

  // Erros lançados pelo service com mensagens amigáveis
  if (err instanceof Error) {
    // Status padrão: 400 (Bad Request)
    let status = 400;

    // Prisma record not found
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      status = 404;
    }

    res.status(status).json({ message: err.message });
    return;
  }

  // Erros inesperados
  res.status(500).json({ message: 'Internal server error', details: err?.message || err });
};

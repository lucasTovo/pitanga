import { Request, Response, NextFunction } from "express";
import { jwtVerify, createRemoteJWKSet } from "jose";
import logger from "../shared/logger";

// Extende o tipo Request para incluir a propriedade 'user'
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

import fetch from 'node-fetch'
(globalThis as any).fetch = fetch;

const JWKS = createRemoteJWKSet(new URL(process.env.KEYCLOAK_JWK_CERTS!));
logger.info({ data:{ JWKS } }, 'JWKS carregado');

export const authenticate = async (req: Request, res: Response, _next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    try {
        const { payload, protectedHeader } = await jwtVerify(token, JWKS, {
            issuer: process.env.KEYCLOAK_ISSUER, 
            audience: 'account',
        });

        logger.debug({ data:{ protectedHeader, payload } }, 'Token verificado com sucesso');
        req.user = payload;
        return _next();

    } catch (error: any) {
        logger.error({ error: error.message }, 'Erro ao verificar token');
        return res.status(401).json({ message: 'Token inválido', details: error.message });
    }
}
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import https from 'https';
import { schoolClassRouter } from './routes/school-class.routes';
import { errorHandler } from './middlewares/error.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// middlewares
app.use(cors({
    origin: true, // endereço do seu React dev server
    credentials: true,                // permite enviar cookies/autenticação
  }));
app.use(express.json());

// rotas
app.use('/classes', schoolClassRouter);
app.use(errorHandler);

// carregar certificados
const httpsOptions = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH || 'certs/server.key'),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH || 'certs/server.cert'),
};

// iniciar servidor HTTPS
https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`School Classes service running on https://localhost:${PORT}`);
});

import pino from 'pino';

const logger = pino({
  level: 'info', // níveis: trace, debug, info, warn, error, fatal
  transport: {
    target: 'pino-pretty', // para deixar os logs legíveis no dev
    options: { colorize: true }
  }
});

export default logger;
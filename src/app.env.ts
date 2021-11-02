import * as dotenv from 'dotenv';

dotenv.config();

const env = {
  HOST: process.env.HOST ?? '0.0.0.0',
  PORT: process.env.PORT ?? 3000,
  LOG_CONSOLE_LEVEL: process.env.LOG_CONSOLE_LEVEL as string,
  LOG_FILE_ACTIVE: (process.env.LOG_FILE_ACTIVE ?? 'false') === 'true',
  LOG_FILE_LEVEL: process.env.LOG_FILE_LEVEL as string,
  LOG_FILE_NAME: process.env.LOG_FILE_NAME as string,
  BASE_PATH: (process.env.BASE_PATH ?? '') as string,
  WEB_SOCKET_TRACCAR_URL: process.env.WEB_SOCKET_TRACCAR_URL as string,
  HTTP_TRACCAR_URL: process.env.HTTP_TRACCAR_URL as string,
  HTTP_TRACCAR_TOKEN: process.env.HTTP_TRACCAR_TOKEN as string,
};

export default Object.freeze(env);

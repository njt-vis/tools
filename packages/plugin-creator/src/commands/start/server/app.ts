import * as path from 'path';
import http from 'http';

import {
  compile,
  getApplication,
  copyFileToBundle,
  cleanBundleCache,
} from '@njt-vis-tools/plugin-compile';

import logger from '../../../utils/logger';
import router from './routes';
import { hotUpdate } from './listener';

const SocketIO = require('socket.io');
const Koa = require('koa');
const koaLogger = require('koa-logger');
const cors = require('@koa/cors');
const staticCache = require('koa-static-cache');

const application = getApplication();

const baseURL = `/${application.name}/-1`;

const app = new Koa();

const server = http.createServer(app.callback());
const io = SocketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const mode = 'development';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function startup({ port, hot }: CommandOptions) {
  await cleanBundleCache(mode);
  await compile({ mode });
  copyFileToBundle(mode, path.resolve(), 'application.json');

  app.use(
    cors({
      origin: ctx => ctx.header.origin,
      credentials: true,
      allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    })
  );
  // 添加日志
  app.use(koaLogger());
  // 注入 soket
  app.use(async (ctx, next) => {
    ctx.io = io;
    await next();
  });
  // 监听文件变化, 推送消息
  if (hot) {
    hotUpdate(io);
  }
  logger.info('Listen . . .');

  // 静态资源目录(development 构建目标目录)
  app.use(
    staticCache(path.resolve('public'), {
      prefix: baseURL,
    })
  );
  app.use(
    staticCache(path.resolve('static'), {
      prefix: baseURL,
    })
  );
  // 路由
  app.use(router.routes()).use(router.allowedMethods());

  server.listen(port, () => {
    logger.info(`PUBLIC_URL: http://127.0.0.1:${port}/`);
    logger.info('Development server is ready.');
  });
}

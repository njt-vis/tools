import * as path from 'path';
import http from 'http';

import { getApplication } from '@njt-vis-tools/plugin-compile';

import router from './routes';
import logger from '../../../utils/logger';
import {
  addPluginStore,
  isPluginAlive,
  isPortOccupied,
} from '../../../utils/common';
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

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function startup({ port, hot }: CommandOptions) {
  if (!port) {
    logger.error('Option port is must.');
    return;
  }

  if (Number.isNaN(Number(port))) {
    logger.error('Option port should be a number.');
    return;
  }

  const isAlive = await isPluginAlive();

  if (isAlive) {
    logger.error('Plugin is alive.');
    return;
  }

  const isOccupied = await isPortOccupied(Number(port));

  if (isOccupied) {
    logger.error(`Port ${port} is occupied.`);
    return;
  }

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

  // 添加存储
  addPluginStore({
    port: Number(port),
    hot: hot ?? false,
  });

  // 监听文件变化
  hotUpdate(io);
}

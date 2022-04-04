import Router from 'koa-router';
import { compile } from '@njt-vis-tools/plugin-compile';
import { API_PREFIX } from '../../../setting';

const router = new Router({ prefix: API_PREFIX });

router.get('/is_alive', async ctx => {
  ctx.body = {
    code: 0,
    data: 'alive',
  };
});

router.post('/hot_bundle', async ctx => {
  try {
    await compile({ mode: 'development' });
    ctx.io.emit('BUNDLE_SUCCESS', Date.now());

    ctx.body = {
      code: 0,
    };
  } catch ({ errors }) {
    ctx.io.emit('BUNDLE_ERROR', { errors });
    ctx.body = {
      code: 10001,
      errors,
    };
  }
});

export default router;

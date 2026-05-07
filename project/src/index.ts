import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static';
import menuRouter from './menu-router.js';
import orderRouter from './order-router.js';

const app = new Hono();

app.use('/*', serveStatic({ root: './public' }));

app.get('/', (c) => {
  return c.text('Hello Hono! 환영합니다!');
});

app.route('/api/menus', menuRouter);
app.route('/api/orders', orderRouter);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);

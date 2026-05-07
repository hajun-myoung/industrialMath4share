# Weekly lectures - week9

1. Make project directory

1. Install hono package
   1. Trouble shoutting: Korean-included root, need to set eng only root, and migrate it

1. run by npm(yarn)

## Description for web framework

1. Web server, using Hono
   1. MEMO: This is web server framework

1. packages - scripts

1. `.tsx`

1. javascript and typescript

1. same commands of js

1. basic code explain:

   ```ts
   import { serve } from '@hono/node-server';
   import { Hono } from 'hono';

   const app = new Hono();

   app.get('/', (c) => {
     return c.text('Hello Hono!');
   });

   serve(
     {
       fetch: app.fetch,
       port: 3000,
     },
     (info) => {
       console.log(`Server is running on http://localhost:${info.port}`);
     },
   );
   ```

1. kiosk blueprint
   1. client
      1. menu-view, order, order-handler
   1. client-admin
      1. admin-signin, menu-modify, stats

1. using public directory(static serve)

1. applying external css

1. link to admin page

1. make admin page

1. pipeline
   - menu save(server)
   - load(client)
   - CRUD

1. Static Directory
   1. publicity(open source)
   1. "/\*" routing
   1. root concept
   1. root and root/index.html
   1. move by link, move by url input

1. SQLite
   1. example files

1. menu-router, order-router

1. importing in index.ts

1. API Testor
   1. Bruno
   1. Postman
   1. Insomnia

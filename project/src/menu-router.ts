import { Hono } from 'hono';
import { createMenu, getAllMenus, removeMenuById, updateMenuById } from './data/queries.js';
import { nanoid } from 'nanoid';
import { HTTPException } from 'hono/http-exception';
import { type MenuInput } from './data/model.js';
const app = new Hono();
app.get('/', (c) => {
  const menus = getAllMenus();
  return c.json(menus);
});
app.post('/', async (c) => {
  const menu = await c.req.json<MenuInput>();
  const menuId = nanoid();
  const newMenu = createMenu(menuId, menu.name, menu.price, menu.category, Date.now(), menu.image);
  if (!newMenu) {
    throw new HTTPException(500, { message: 'DB Insert Error' });
  }
  return c.json({
    ...newMenu,
    createdAt: new Date(newMenu.createdAt).toISOString(),
  });
});
app.delete('/:id', async (c) => {
  const id = c.req.param('id');
  removeMenuById(id);
  return c.text('successfully removed');
});
app.put('/:id', async (c) => {
  const id = c.req.param('id');
  const menu = await c.req.json();
  updateMenuById(id, menu);
  return c.text('successfully updateted');
});
export default app;

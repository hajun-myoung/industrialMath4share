import { Hono } from 'hono';
import type { OrderDetailInput } from './data/model.js';
import { createOrder, createOrderDetail, getMenuByMenuId } from './data/queries.js';
import { nanoid } from 'nanoid';
const app = new Hono();
// create an order
app.post('/', async (c) => {
  const orderDetailInputs = await c.req.json<OrderDetailInput[]>();
  // calculate total price
  let totalPrice = 0;
  const preOrderDetails = orderDetailInputs.map((orderDetail) => {
    const menu = getMenuByMenuId(orderDetail.menu_id);
    totalPrice += menu.price * orderDetail.quantity;
    return {
      menu_name: menu.name,
      price: menu.price,
      quantity: orderDetail.quantity,
    };
  });
  // create a menu
  const menuId = nanoid();
  const order = createOrder(menuId, totalPrice, Date.now());
  const newOrderDetails = preOrderDetails.map((orderDetail) => {
    const orderDetailId = nanoid();
    return createOrderDetail(
      orderDetailId,
      orderDetail.menu_name,
      orderDetail.price,
      orderDetail.quantity,
      Date.now(),
      order.id,
    );
  });
  return c.json({
    orderId: order.id,
    totalPrice: order.totalPrice,
    orderedAt: order.orderedAt,
    orderDetails: newOrderDetails,
  });
});
export default app;

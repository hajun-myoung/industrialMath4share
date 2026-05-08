import db, {
  type MenuResponse,
  type OrderDetailResponse,
  type Order,
  type MenuName,
} from './model.js';
const TABLE_NAMES = {
  menus: 'menus',
  orders: 'orders',
  order_details: 'order_details',
};

// menu
// Update: Menu i18n
const createMenu = (
  menuId: string,
  menuName: MenuName,
  price: number,
  category: string,
  createdAt: number,
  image?: string,
) =>
  db
    .prepare(
      `
  INSERT INTO ${TABLE_NAMES.menus} 
    (menu_id, menu_name, price, category, created_at, image)
  VALUES (?, ?, ?, ?, ?, ?)
  RETURNING menu_id AS id, menu_name AS name, 
    price, category, created_at AS createdAt, image 
  `,
    )
    .get(menuId, JSON.stringify(menuName), price, category, createdAt, image ?? '') as
    | MenuResponse
    | undefined;
const getAllMenus = () =>
  db
    .prepare(
      `
  SELECT menu_id AS id, menu_name AS name, 
    price, category, created_at AS createdAt, image
  FROM ${TABLE_NAMES.menus}
  `,
    )
    .all() as unknown as MenuResponse[];
const getMenuByMenuId = (menuId: MenuName) =>
  db
    .prepare(
      `
  SELECT 
    menu_id AS id, menu_name AS name, price, category, created_at AS createdAt, image 
  FROM ${TABLE_NAMES.menus} WHERE menu_id = ?
  `,
    )
    .get(JSON.stringify(menuId)) as unknown as MenuResponse;
const removeMenuById = (menuId: string) => {
  db.exec(`
    DELETE FROM ${TABLE_NAMES.menus} WHERE menu_id='${menuId}'
    `);
};
const updateMenuById = (menuId: string, menu: any) => {
  db.exec(`
    UPDATE ${TABLE_NAMES.menus}
    SET 
      menu_name ='${menu.name}',
      price = ${menu.price},
      category = '${menu.category}',
      image = '${menu.image ?? ''}'
    WHERE menu_id = '${menuId}'
    `);
};
// order
const createOrder = (orderId: string, totalPrice: number, orderedAt: number) => {
  return db
    .prepare(
      `
    INSERT INTO ${TABLE_NAMES.orders} 
      (order_id, total_price, ordered_at) 
    VALUES (?, ?, ?) 
    RETURNING order_id AS id, total_price AS totalPrice, ordered_at AS orderedAt
    `,
    )
    .get(orderId, totalPrice, orderedAt) as unknown as Order;
};
// order detail
const createOrderDetail = (
  orderDetailId: string,
  menuName: MenuName,
  price: number,
  quantity: number,
  createdAt: number,
  orderId: string,
) => {
  return db
    .prepare(
      `
    INSERT INTO ${TABLE_NAMES.order_details} 
      (order_detail_id, menu_name, price, quantity, created_at, order_id) 
    VALUES (?, ?, ?, ?, ?, ?) 
    RETURNING order_detail_id AS orderDetailId, menu_name AS name, price, quantity, created_at AS createdAt
    `,
    )
    .get(
      orderDetailId,
      JSON.stringify(menuName),
      price,
      quantity,
      createdAt,
      orderId,
    ) as unknown as OrderDetailResponse;
};
export {
  createMenu,
  createOrder,
  createOrderDetail,
  getAllMenus,
  getMenuByMenuId,
  removeMenuById,
  updateMenuById,
};

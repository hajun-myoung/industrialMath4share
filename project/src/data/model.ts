import { DatabaseSync } from 'node:sqlite';
const db = new DatabaseSync(`${import.meta.dirname}/main.db`);
const initDatabase = `
CREATE TABLE IF NOT EXISTS menus (
  menu_id TEXT PRIMARY KEY,
  menu_name TEXT NOT NULL UNIQUE,
  price INTEGER NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  image TEXT,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS orders (
  order_id TEXT PRIMARY KEY,
  total_price INTEGER NOT NULL,
  order_status TEXT NOT NULL DEFAULT 'pending',
  ordered_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS order_details (
  order_detail_id TEXT PRIMARY KEY,
  menu_name TEXT NOT NULL,
  price INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  order_id TEXT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders (order_id)
);
`;
db.exec(initDatabase);
export interface Order {
  id: string;
  totalPrice: number;
  orderedAt: string;
}
export interface OrderResponse extends Order {
  orderDetails: OrderDetailResponse[];
}
export interface OrderDetailInput {
  menu_id: string;
  quantity: number;
}
export interface OrderDetailResponse {
  orderDetailId: string;
  name: string;
  price: number;
  quantity: number;
  createdAt: string;
}

// Update: menuName i18n
type LanguageCode = 'kor' | 'eng' | 'esp';
export interface MenuName {
  menuname: Partial<Record<LanguageCode, string>>;
}

export interface MenuResponse {
  id: string;
  name: MenuName;
  price: number;
  category: string;
  createdAt: string;
  image?: string;
}
export interface MenuInput {
  name: MenuName;
  price: number;
  category: string;
  image?: string;
}
export default db;

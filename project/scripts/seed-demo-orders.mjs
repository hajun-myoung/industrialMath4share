import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:3000';
const DB_PATH = path.join(__dirname, '..', 'src', 'data', 'main.db');
const LAST_MONTH_ORDER_COUNT = Number(process.env.LAST_MONTH_ORDER_COUNT ?? 120);
const THIS_MONTH_ORDER_COUNT = Number(process.env.THIS_MONTH_ORDER_COUNT ?? 90);

const db = new DatabaseSync(DB_PATH);

const updateOrderTime = db.prepare(`
  UPDATE orders
  SET ordered_at = ?
  WHERE order_id = ?
`);

const updateOrderDetailTime = db.prepare(`
  UPDATE order_details
  SET created_at = ?
  WHERE order_detail_id = ?
`);

const menus = await fetchMenus();
const weightedMenus = createWeightedMenus(menus);
const now = new Date();
const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

let createdCount = 0;

createdCount += await seedOrders({
  count: LAST_MONTH_ORDER_COUNT,
  startDate: lastMonthStart,
  endDate: lastMonthEnd,
  weightedMenus,
});

createdCount += await seedOrders({
  count: THIS_MONTH_ORDER_COUNT,
  startDate: thisMonthStart,
  endDate: now,
  weightedMenus,
});

db.close();

console.log(`[DONE] ${createdCount} demo orders created.`);
console.log(`[INFO] last month: ${formatDate(lastMonthStart)} ~ ${formatDate(lastMonthEnd)}`);
console.log(`[INFO] this month: ${formatDate(thisMonthStart)} ~ ${formatDate(now)}`);

async function seedOrders({ count, startDate, endDate, weightedMenus }) {
  let createdCount = 0;

  for (let i = 0; i < count; i += 1) {
    const orderedAt = createRealisticTimestamp(startDate, endDate);
    const payload = createOrderPayload(weightedMenus);
    const order = await createOrder(payload);

    updateOrderTime.run(orderedAt, order.orderId);

    for (const orderDetail of order.orderDetails) {
      updateOrderDetailTime.run(orderedAt, orderDetail.orderDetailId);
    }

    createdCount += 1;
  }

  return createdCount;
}

async function fetchMenus() {
  const response = await fetch(`${API_BASE_URL}/api/menus`);

  if (!response.ok) {
    throw new Error(`Failed to load menus from ${API_BASE_URL}/api/menus: ${response.status}`);
  }

  const menus = await response.json();

  if (!Array.isArray(menus) || menus.length === 0) {
    throw new Error('No menus found. Run the app with seeded menu data first.');
  }

  return menus;
}

async function createOrder(payload) {
  const response = await fetch(`${API_BASE_URL}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to create order: ${response.status} ${await response.text()}`);
  }

  return response.json();
}

function createWeightedMenus(menus) {
  return menus.flatMap((menu, index) => {
    const name = parseMenuName(menu.name);
    const isPopularDrink =
      name.includes('아메리카노') || name.includes('라떼') || name.includes('밀크티');
    const isPremium = Number(menu.price) >= 8000;
    const weight = isPopularDrink ? 8 : isPremium ? 2 : Math.max(2, 6 - Math.floor(index / 4));

    return Array.from({ length: weight }, () => menu);
  });
}

function createOrderPayload(weightedMenus) {
  const itemCount = randomInt(1, weightedChance(0.72) ? 2 : 4);
  const selectedMenuIds = new Set();
  const payload = [];

  while (payload.length < itemCount) {
    const menu = pickOne(weightedMenus);
    if (selectedMenuIds.has(menu.id)) continue;

    selectedMenuIds.add(menu.id);
    payload.push({
      menu_id: menu.id,
      quantity: createQuantity(),
    });
  }

  return payload;
}

function createQuantity() {
  const roll = Math.random();

  if (roll < 0.72) return 1;
  if (roll < 0.93) return 2;
  return randomInt(3, 5);
}

function createRealisticTimestamp(startDate, endDate) {
  const date = randomDate(startDate, endDate);
  const hour = pickWeighted([
    { value: 8, weight: 6 },
    { value: 9, weight: 9 },
    { value: 10, weight: 8 },
    { value: 11, weight: 5 },
    { value: 12, weight: 7 },
    { value: 13, weight: 7 },
    { value: 14, weight: 4 },
    { value: 15, weight: 5 },
    { value: 16, weight: 4 },
    { value: 17, weight: 6 },
    { value: 18, weight: 8 },
    { value: 19, weight: 6 },
    { value: 20, weight: 3 },
    { value: 21, weight: 2 },
  ]);

  date.setHours(hour, randomInt(0, 59), randomInt(0, 59), randomInt(0, 999));

  return date.getTime();
}

function randomDate(startDate, endDate) {
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();
  let date = new Date(randomInt(startTime, endTime));
  let safetyCount = 0;

  while (isLowTrafficDay(date) && weightedChance(0.55) && safetyCount < 10) {
    date = new Date(randomInt(startTime, endTime));
    safetyCount += 1;
  }

  return date;
}

function isLowTrafficDay(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function pickWeighted(items) {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let cursor = Math.random() * totalWeight;

  for (const item of items) {
    cursor -= item.weight;
    if (cursor <= 0) return item.value;
  }

  return items[items.length - 1].value;
}

function pickOne(items) {
  return items[randomInt(0, items.length - 1)];
}

function weightedChance(chance) {
  return Math.random() < chance;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function parseMenuName(rawName) {
  try {
    return JSON.parse(rawName).kor ?? '';
  } catch {
    return String(rawName ?? '');
  }
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

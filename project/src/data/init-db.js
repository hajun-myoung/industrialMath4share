import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'main.db');
const schemaPath = path.join(__dirname, 'schema.sql');
const seedPath = path.join(__dirname, 'seed.json');

if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

const db = new DatabaseSync(dbPath);

db.exec(fs.readFileSync(schemaPath, 'utf-8'));

const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));

const insert = db.prepare(`
  INSERT INTO menus 
    (menu_id, menu_name, price, category, created_at, image)
  VALUES (?, ?, ?, ?, ?, ?)
`);

for (const menu of seedData) {
  insert.run(menu.id, menu.name, menu.price, menu.category, menu.createdAt, menu.image ?? '');

  console.log(`[INFO] Menu Added: ${JSON.parse(menu.name).kor}`);
}

db.close();

console.log('✅ SQLite database initialized successfully');

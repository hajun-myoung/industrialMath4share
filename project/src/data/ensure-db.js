import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'main.db');
const initDbPath = path.join(__dirname, 'init-db.js');

if (fs.existsSync(dbPath)) {
  console.log('[INFO] SQLite database already exists');
  process.exit(0);
}

console.log('[INFO] SQLite database not found. Initializing...');

const result = spawnSync(process.execPath, [initDbPath], {
  stdio: 'inherit',
});

process.exit(result.status ?? 1);

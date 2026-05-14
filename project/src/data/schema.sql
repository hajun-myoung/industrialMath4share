DROP TABLE IF EXISTS menus;

CREATE TABLE menus (
  menu_id TEXT PRIMARY KEY,
  menu_name TEXT NOT NULL,
  price INTEGER NOT NULL,
  category TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  image TEXT
);
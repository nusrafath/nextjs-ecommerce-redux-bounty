import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

let db: Database | null = null;

async function openDb(): Promise<Database> {
  if (!db) {
    db = await open({
      filename: './mydb.sqlite',
      driver: sqlite3.Database
    });
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT CHECK( role IN ('ADMIN', 'SELLER', 'CUSTOMER') ) DEFAULT 'CUSTOMER'
      );
    `);
    await db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        quantity INTEGER NOT NULL,
        description TEXT NOT NULL,
        seller_id INTEGER NOT NULL,
        FOREIGN KEY (seller_id) REFERENCES users(id)
      );
    `);
  }
  return db;
}

async function resetProductsTable(): Promise<void> {
  const db = await openDb();
  await db.exec(`
    DROP TABLE IF EXISTS products;
    CREATE TABLE products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      description TEXT NOT NULL,
      seller_id INTEGER NOT NULL,
      FOREIGN KEY (seller_id) REFERENCES users(id)
    );
  `);
  console.log('Products table reset successfully');
}

export { openDb, resetProductsTable };

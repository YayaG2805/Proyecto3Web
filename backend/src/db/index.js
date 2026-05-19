import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "tu_password",
  database: process.env.DB_NAME || "fase1_items"
});

export function query(text, params) {
  return pool.query(text, params);
}

export async function initDb() {
  await query(`
    CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      categoriaId TEXT,
      estado TEXT,
      puntuacion REAL,
      fechaRegistro TEXT,
      fechaActividad TEXT,
      notas TEXT,
      atributos TEXT,
      activo INTEGER DEFAULT 1
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS registros (
      id TEXT PRIMARY KEY,
      itemId TEXT REFERENCES items(id),
      fecha TEXT,
      valor REAL,
      notas TEXT
    );
  `);
}

import dotenv from "dotenv";
dotenv.config();

import { Pool } from "pg";

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
  options: '-c search_path="$user",extensions',
});
console.log(
  process.env.DB_HOST,
  process.env.DB_PORT,
  process.env.DB_NAME,
  process.env.DB_USER
);
(async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("PostgreSQL connected at:", result.rows[0].now);
  } catch (err) {
    console.error("DB connection failed:", err.message);
  }
})();

export default pool;

import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
dotenv.config();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
(async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("PostgreSQL connected at:", result.rows[0].now);
  } catch (err) {
    console.error("DB connection failed:", err.message);
  }
})();
export default pool;

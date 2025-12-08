import pool from "../config/db.js";

const saveFCMToken = async (userId, fcmToken) => {
  const sql = `
    UPDATE USERS
    SET fcm_token = $1
    WHERE id = $2
  `;

  await pool.query(sql, [fcmToken, userId]);
  return;
};

const getFCMToken = async (userId) => {
  const sql = `
    SELECT fcm_token
    FROM USERS
    WHERE id = $1
  `;
  const result = await pool.query(sql, [userId]);
  return result?.rows?.[0].fcm_token || null;
};

export default { saveFCMToken, getFCMToken };

import pool from "../config/db.js";

const getBinManagers = async (binId) => {
  const sql = `
    SELECT *
    FROM USERS
    WHERE bin_id = $1
  `;
  const result = (await pool.query(sql, [binId])).rows;
  return result.map((item) => {
    return {
      id: item.id,
      email: item.email,
    };
  });
};

const loginUserAndGet = async (loginPayload) => {
  const { email, password } = loginPayload;
  const sql = `
    SELECT *
    FROM USERS
    WHERE email = $1 AND password = $2
  `;

  const user =
    (await pool.query(sql, [email, password]))?.rows?.[0] || undefined;
  console.log(email, password, "kk", user);
  if (!user) return undefined;

  return {
    id: user.id,
    email: user.email,
    bin_id: user.bin_id,
    role: "user",
  };
};

const registerUserAndGet = async (registerPayload) => {
  const { email, password, bin_id, bin_password } = registerPayload;
  const userCheckSql = `
    SELECT 1
    FROM USERS
    WHERE email = $1
  `;

  const binCheckSql = `
    SELECT password
    FROM BINS
    WHERE id = $1
  `;

  const promises = [
    pool.query(userCheckSql, [email]),
    pool.query(binCheckSql, [bin_id]),
  ];

  const [userCheckResult, binCheckResult] = await Promise.all(promises);
  if (userCheckResult.rowCount == 1)
    return {
      success: false,
      log: "Email existed",
    };
  if (binCheckResult.rowCount == 0)
    return {
      success: false,
      log: "Bin ID does not exist",
    };
  else if (binCheckResult.rows[0].password != bin_password)
    return {
      success: false,
      log: "Wrong bin password",
    };

  const registerSql = `
    INSERT INTO USERS (email, password, bin_id)
    VALUES ($1, $2, $3)
    RETURNING *
  `;

  const userData =
    (await pool.query(registerSql, [email, password, bin_id]))?.rows?.[0] ||
    null;

  if (!userData)
    return {
      success: false,
      log: "Unable to register the account",
    };

  return {
    success: true,
    log: "Register account successfully!",
    user: {
      id: userData.id,
      email: userData.email,
      bin_id: userData.bin_id,
      role: "user",
    },
  };
};

const getManagedBinId = async (userId) => {
  const sql = `
    SELECT bin_id
    FROM USERS
    WHERE id = $1
  `;

  const binId = (await pool.query(sql, [userId]))?.rows;

  return binId;
};

export default {
  getBinManagers,
  loginUserAndGet,
  registerUserAndGet,
  getManagedBinId,
};

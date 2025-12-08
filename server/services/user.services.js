import pool from "../config/db.js";

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
      log: "Email đã tồn tại",
    };
  if (binCheckResult.rowCount == 0)
    return {
      success: false,
      log: "ID thùng rác không tồn tại",
    };
  else if (binCheckResult.rows[0].password != bin_password)
    return {
      success: false,
      log: "Mật khẩu thùng rác sai",
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
      log: "Không thể tạo tài khoản",
    };

  return {
    success: true,
    log: "Đăng ký thành công",
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

export default { loginUserAndGet, registerUserAndGet, getManagedBinId };

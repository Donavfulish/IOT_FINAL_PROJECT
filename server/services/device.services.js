import pool from "../config/db.js";
import protocolServices from "./protocol.services.js";
import firebaseServices from "./firebase.services.js";
import admin from "firebase-admin";

const sendFaultSignal = async (binId) => {
  if (!binId) return;

  protocolServices.protocolServices.sendToFrontendBySocket({
    id: "button-fault-signal",
  });

  const logAndAlertPromises = [
    createEventLogService(binId, `Device malfunction or unwanted working`),
    createSystemAlertService(
      binId,
      "Device malfunction",
      "The bin may working unwantedly or under malfuncition",
      "warning"
    ),
  ];

  await Promise.all(logAndAlertPromises);
};

const sendTemp = (temp) => {
  protocolServices.sendToFrontendBySocket({
    id: "temp",
    temp: temp,
  });
};

const warningHighTemperature = async (binId, temp) => {
  const nearestTempAlertSql = `
    SELECT time_at
    FROM ALERTS
    WHERE bin_id = $1 AND title = 'High temperature'
    ORDER BY time_at DESC
    LIMIT 1
  `;

  const nearestTempAlertResult = await pool.query(nearestTempAlertSql, [binId]);
  const nearestTime = nearestTempAlertResult?.rows?.[0]?.time_at || null;

  // Nếu hiện tại cách alert gần nhất là 15 phút thì alert lần nữa
  if (!nearestTime || new Date() - new Date(nearestTime) > 15 * 60 * 1000) {
    // 1. Định nghĩa các tác vụ Logging và Alert
    const logAndAlertPromises = [
      createEventLogService(
        binId,
        `High temperature possibly fire: ${temp} Celcius`
      ),
      createSystemAlertService(
        binId,
        "High temperature",
        `High temperature, fire or explosion possibly occurs: ${temp} Celcius`,
        "danger"
      ),
    ];

    // 2. Lấy danh sách quản lý
    const managerSql = `
      SELECT id
      FROM USERS
      WHERE bin_id = $1
    `;

    const managers = (await pool.query(managerSql, [binId]))?.rows;

    if (!managers || managers.length === 0) {
      // Nếu không có người quản lý, vẫn hoàn thành việc ghi log/alert rồi thoát
      await Promise.all(logAndAlertPromises);
      return;
    }

    // 3. Lấy tất cả Tokens và lọc bỏ các token null/undefined
    const tokens = (
      await Promise.all(
        managers.map((user) => firebaseServices.getFCMToken(user.id))
      )
    ).filter((token) => token);

    if (tokens.length === 0) {
      // Nếu không có Token nào hợp lệ, vẫn hoàn thành việc ghi log/alert rồi thoát
      await Promise.all(logAndAlertPromises);
      return;
    }

    // 4. Tạo mảng các Promise Gửi thông báo
    const notificationPromises = tokens.map((token) => {
      const message = {
        notification: {
          title: "Nhiệt độ cao, dễ cháy!",
          body: `Nhiệt độ thùng rác đã đạt ngưỡng rất cao: ${temp} độ C`,
        },
        data: {},
        token: token,
      };

      return admin.messaging().send(message);
    });

    // 5. Chạy tất cả các Promise (Logging, Alert, và Notifications) song song
    await Promise.all([...logAndAlertPromises, ...notificationPromises]);
  }
};

const sendFillLevel = (level) => {
  protocolServices.sendToFrontendBySocket({
    id: "fill_level",
    level: level,
  });
};

const getOledMessageService = async (id) => {
  try {
    const sql = `
                SELECT message 
                FROM public.bins
                WHERE id = $1
                `;
    const params = [id];
    return (await pool.query(sql, params)).rows[0];
  } catch (error) {
    console.log(error);
  }
};

const updateOledMessageService = async (id, message) => {
  try {
    const sql = `
                UPDATE public.bins  
                SET message = $2 
                WHERE id = $1
                `;
    const params = [id, message];

    return (await pool.query(sql, params)).rows[0];
  } catch (error) {
    console.log(error);
  }
};

const getTempInOneHourService = async (id) => {
  try {
    let sql = `
                SELECT b.temperature as temp, (b.time_at + INTERVAL '7 hours') as time
                FROM public.bin_histories as b
                WHERE b.bin_id = $1 AND time_at >= NOW() - INTERVAL '1 hour'
                  `;
    const params = [id];
    const result1 = await pool.query(sql, params);
    //Nếu ko có trong 1 giờ sẽ lấy nhiệt độ gần nhất
    if (result1.rowCount === 0) {
      sql = `
                SELECT b.temperature as temp, NOW() + INTERVAL '7 hours' AS time
                FROM public.bin_histories as b
                WHERE b.bin_id = $1 AND time_at = (SELECT MAX (bc.time_at)
                                                    FROM public.bin_histories as bc
                                                    WHERE bc.bin_id = $1)
                `;

      const result2 = await pool.query(sql, params);
      return result2.rows;
    } else {
      return result1.rows;
    }
  } catch (error) {
    console.log(error);
  }
};

const createTempHistoryService = async (id, nowTemp) => {
  try {
    const sql = `
                  INSERT INTO public.bin_histories (bin_id, temperature, time_at)
                  VALUES($1 ,$2 , NOW() )
                  `;
    const params = [id, nowTemp];

    return (await pool.query(sql, params)).rows[0];
  } catch (error) {
    console.log(error);
  }
};

const updateFillLevelService = async (id, nowLevel) => {
  try {
    console.log(nowLevel);
    const sql = `
                  UPDATE public.bins 
                  SET fill_level = $1
                  WHERE id = $2
                  `;
    const params = [nowLevel, id];
    const result = await pool.query(sql, params);
    return result.rows[0];
  } catch (error) {
    console.log(error);
  }
};

const getEventLogService = async (id) => {
  try {
    const sql = `
                  SELECT e.message, e.time_at FROM public.event_logs as e WHERE e.bin_id = $1
                   `;
    const params = [id];
    const result = await pool.query(sql, params);
    return result.rows;
  } catch (error) {
    console.log(error);
  }
};

const createEventLogService = async (id, message) => {
  try {
    console.log(message);
    const sql = `
                  INSERT INTO public.event_logs (bin_id, message, time_at)
                  VALUES($1 ,$2 , NOW())
                  `;
    const params = [id, message];
    const result = await pool.query(sql, params);
    return result.rows[0];
  } catch (error) {
    console.log(error);
  }
};

const getSystemAlertService = async (id) => {
  try {
    const sql = `
                  SELECT a.title, a.message, a.time_at, a.type FROM public.alerts as a WHERE a.bin_id = $1
                   `;
    const params = [id];
    const result = await pool.query(sql, params);
    return result.rows;
  } catch (error) {
    console.log(error);
  }
};

const createSystemAlertService = async (id, title, message, type) => {
  try {
    console.log(message);
    const sql = `
                  INSERT INTO public.alerts (bin_id,title, message, time_at, type)
                  VALUES($1 ,$2 ,$3, NOW(), $4)
                  `;
    const params = [id, title, message, type];
    const result = await pool.query(sql, params);
    return result.rows[0];
  } catch (error) {
    console.log(error);
  }
};

const updateLedConfigService = async (
  id,
  led_mode,
  time_on_led,
  time_off_led
) => {
  try {
    const sql = `
        UPDATE public.bins  
        SET led_mode = $2,
            time_on_led = $3,
            time_off_led = $4
        WHERE id = $1
        RETURNING *
    `;
    const params = [id, led_mode, time_on_led, time_off_led];
    return (await pool.query(sql, params)).rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
  sendFaultSignal,
  getOledMessageService,
  updateOledMessageService,
  updateLedConfigService,
  createTempHistoryService,
  getTempInOneHourService,
  sendTemp,
  updateFillLevelService,
  createEventLogService,
  createSystemAlertService,
  sendFillLevel,
  getEventLogService,
  getSystemAlertService,
  warningHighTemperature,
};

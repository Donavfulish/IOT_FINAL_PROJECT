import pool from "../config/db.js";
import protocolServices from "./protocol.services.js";
import pushbulletServices from "./pushbullet.services.js";

const sendFaultSignal = async (binId) => {
  if (!binId) return;

  protocolServices.sendToFrontendBySocket({
    id: "button-fault-signal",
    message: "The bin may working unwantedly or under malfuncition",
    type: "warning",
  });

  const logAndAlertPromises = [
    createEventLogService(
      binId,
      `The bin may working unwantedly or under malfuncition`,
      "warning"
    ),
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
    protocolServices.sendToFrontendBySocket({
      id: "event",
      binId,
      message: `High temperature possibly fire: ${temp} Celcius`,
      type: temp > 60 ? "danger" : "warning",
    });
    const promises = [
      createEventLogService(
        binId,
        `High temperature possibly fire: ${temp} Celcius`,
        temp > 60 ? "danger" : "warning"
      ),
      createSystemAlertService(
        binId,
        "High temperature",
        `High temperature, fire or explosion possibly occurs: ${temp} Celcius`,
        "danger"
      ),
      pushbulletServices.pushNotification(
        "High temperature",
        `Fire or explosion concerns! Temperature reach ${temp} Celcius`
      ),
    ];

    await Promise.all(promises);
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
    const display_fill = message === "RESET" ? true : false;
    const sql = `
                UPDATE public.bins  
                SET message = $2,
                    is_display_fill = $3
                WHERE id = $1
                `;
    const params = [id, message, display_fill];
    const promises = [
      createEventLogService(
        id,
        message === "RESET"
          ? "Update Oled. Oled now display fill level"
          : `Update Oled. Oled message now is: "${message}"`,
        "info"
      ),
      pool.query(sql, params),
    ];
    const [events, result] = await Promise.all(promises);

    return result.rows[0];
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
                ORDER BY b.time_at ASC
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
    const deleteExpiredSql = `
                  DELETE FROM public.bin_histories
                  WHERE bin_id = $1 AND NOW() - time_at > INTERVAL '1.5 hours'
    `;
    await pool.query(deleteExpiredSql, [id]);

    const insertSql = `
                  INSERT INTO public.bin_histories (bin_id, temperature, time_at)
                  VALUES($1 ,$2 , NOW() )
                  `;
    const params = [id, nowTemp];

    return (await pool.query(insertSql, params)).rows[0];
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
                  SELECT e.message, e.time_at FROM public.event_logs as e WHERE e.bin_id = $1 ORDER BY e.time_at desc
                   `;
    const params = [id];
    const result = await pool.query(sql, params);
    return result.rows;
  } catch (error) {
    console.log(error);
  }
};

const createEventLogService = async (id, message, type) => {
  try {
    console.log(message);
    const sql = `
                  INSERT INTO public.event_logs (bin_id, message, time_at, type)
                  VALUES($1 ,$2 , NOW(), $3)
                  `;
    const params = [id, message, type];
    const result = await pool.query(sql, params);
    return result.rows[0];
  } catch (error) {
    console.log(error);
  }
};

const getSystemAlertService = async (id) => {
  try {
    const sql = `
                  SELECT a.title, a.message, a.time_at, a.type FROM public.alerts as a  WHERE a.bin_id = $1 ORDER BY a.time_at desc
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
  time_off_led,
  is_led_on
) => {
  try {
    const sql = `
        UPDATE public.bins  
        SET led_mode = $2,
            time_on_led = $3,
            time_off_led = $4,
            is_led_on = $5
        WHERE id = $1
        RETURNING *
    `;
    const params = [id, led_mode, time_on_led, time_off_led, is_led_on];
    const promises = [
      createEventLogService(
        id,
        led_mode === "manual"
          ? `Update Led: Led mode is manual, led mode is ${
              is_led_on === true ? "On" : "Off"
            }`
          : `Update Led. Led mode is auto. Led is on from ${time_on_led} to ${time_off_led}`,
        "info"
      ),
      pool.query(sql, params),
    ];
    const [events, result] = await Promise.all(promises);

    return result.rows[0];
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

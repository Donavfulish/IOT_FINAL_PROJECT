import pool from "../config/db.js";

const getAllBins = async () => {
  const sql = `
    SELECT
      id, battery, fill_level, is_display_fill, message, led_mode,
      time_on_led, time_off_led
    FROM BINS
  `;

  const binsData = (await pool.query(sql))?.rows || [];

  return binsData;
};

const getBinDetailById = async (id) => {
  const detailSql = `
    SELECT *
    FROM BINS
    WHERE ID = $1
  `;

  const alertsSql = `
    SELECT *
    FROM ALERTS
    WHERE BIN_ID = $1
    ORDER BY TIME_AT DESC
  `;

  const eventsSql = `
    SELECT *
    FROM event_logs
    WHERE BIN_ID = $1
    ORDER BY TIME_AT DESC
  `;

  const promises = [pool.query(detailSql, [id]), pool.query(alertsSql, [id]), pool.query(eventsSql, [id])];
  const [detailResult, alertsResult, eventsResult] = await Promise.all(promises);

  const [detail, alerts, events] = [
    detailResult.rows?.[0] || null,
    alertsResult.rows || [],
    eventsResult.rows || [],
  ];
  if (!detail) return {};

  return {
    id: detail.id,
    battery: detail.battery,
    fill_level: detail.fill_level,
    is_display_fill: detail.is_display_fill,
    message: detail.message,
    led_mode: detail.led_mode,
    time_on_led: detail.time_on_led,
    time_off_led: detail.time_off_led,
    is_led_on: detail.is_led_on,
    alerts: alerts.map((log) => {
      return {
        title: log.title,
        message: log.message,
        time_at: log.time_at,
        type: log.type,
      };
    }),
    events: events.map((log) => {
      return {
        message: log.message,
        time_at: log.time_at,
        type: log.type,
      };
    }),
  };
};

export default { getBinDetailById, getAllBins };

import pool from "../config/db.js";
import { sendToFrontendBySocket } from "./protocol.services.js";

export const sendFaultSignal = () => {
  sendToFrontendBySocket({
    id: "button-fault-signal",
  });
};

export const sendTemp = (temp) => {
  sendToFrontendBySocket({
    id: "temp",
    temp: temp,
  });
};

export const getOledMessageService = async (id) => {
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

export const updateOledMessageService = async (id, message) => {
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

export const getTempInOneHourService = async (id) => {
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

export const createTempHistoryService = async (id, nowTemp) => {
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

export const updateFillLevelService = async (id, nowLevel) => {
  try {
    console.log(nowLevel);
    const sql = `
                  UPDATE public.bins 
                  SET fill_level = $1
                  WHERE id = $2
                  `;
    const params = [nowLevel / 100, id];
    const result = await pool.query(sql, params);
    return result.rows[0];
  } catch (error) {
    console.log(error);
  }
};
export const createEventLogService = async (id, message) => {
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
export const createSystemAlertService = async (id, title, message) => {
  try {
    console.log(message);
    const sql = `
                  INSERT INTO public.alerts (bin_id,title, message, time_at)
                  VALUES($1 ,$2 ,$3, NOW())
                  `;
    const params = [id, title, message];
    const result = await pool.query(sql, params);
    return result.rows[0];
  } catch (error) {
    console.log(error);
  }
};

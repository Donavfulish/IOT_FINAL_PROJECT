import { sendToFrontendBySocket } from "./protocol.services.js";

export const sendFaultSignal = () => {
  sendToFrontendBySocket({
    id: "button-fault-signal",
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

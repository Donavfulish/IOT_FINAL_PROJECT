import pool from "../config/db.js";

let mqttClientRef = null;
let wssRef = null;
const TOPIC_PUBLISH = "044153414/smartbin/web";
import { sendFaultSignal } from "./button.services.js";

/**
 * Inject MQTT client + WebSocket server reference
 */
export const initDeviceService = (mqttClient, wss) => {
  mqttClientRef = mqttClient;
  wssRef = wss;
};

/**
 * Send command from controller or WS to ESP via MQTT
 */
export const sendCommandToDevice = (device, command) => {
  if (!mqttClientRef || !wssRef) throw new Error("MQTT or WS not initialized");

  const payload = JSON.stringify(command);
  mqttClientRef.publish(`${TOPIC_PUBLISH}/${device}`, payload);

  // Broadcast to all FE via WS
  wssRef.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ event: "command_sent", command }));
    }
  });

  return { sent: true, command };
};

/**
 * Handle ESP message received via MQTT
 */
export const handleEspMessageFromMqtt = (topic, message) => {
  const data = message.toString();
  const device = topic.split("/").pop();

  if (device === "button") {
    if (data === "device-malfunction") sendFaultSignal(data);
  } else {
    console.log("Not button");
    console.log(data);
  }

  if (device === "ultra") {
    console.log(data);
  }
  if (!wssRef) return;
  wssRef.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ event: "esp_update", message: data }));
    }
    if (!wssRef) return;
    wssRef.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ event: "esp_update", message: data }));
      }
    });
  });
};

/**
 * Send data to Frontend realtime by SocketIO
 * Payload Schema: {
 *    id: string,
 *    ...
 * }
 */
export const sendToFrontendBySocket = (payload) => {
  if (!wssRef) return;

  wssRef.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(payload));
    }
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

import pool from "../config/db.js";
import mqttClient from "../config/mqtt.js";
import { ws } from "../config/websocket.js";

const TOPIC_PUBLISH = "044153414/smartbin/web";

const sendCommandToDevice = (device, command) => {
  if (!mqttClient || !ws) throw new Error("MQTT or WS not initialized");

  const payload = JSON.stringify(command);
  mqttClient.publish(`${TOPIC_PUBLISH}/${device}`, payload);
};

const sendToFrontendBySocket = (payload) => {
  if (!ws) return;

  ws.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(payload));
    }
  });
};

export default { sendCommandToDevice, sendToFrontendBySocket };

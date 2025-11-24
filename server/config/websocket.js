import WebSocket from "ws";
import {
  initDeviceService,
  handleEspMessageFromMqtt,
} from "../services/device.services.js";

/* eslint-disable no-console */
export default function initWebSocket(server, mqttClient) {
  const wss = new WebSocket.Server({ server });

  // Inject MQTT + WS vào service
  initDeviceService(mqttClient, wss);

  wss.on("connection", (ws) => {
    console.log("Frontend WS connected");
    ws.send(JSON.stringify({ message: "Connected to backend WS" }));

    // FE → WS → MQTT → ESP
    ws.on("message", (msg) => {
      try {
        const parsed = JSON.parse(msg.toString());
        if (parsed.command) {
          mqttClient.publish("044153414/trashbin/web", JSON.stringify(parsed));
        }
      } catch (e) {
        console.error("WS message parse error:", e);
      }
    });
  });

  // ESP → MQTT → Service → WS → FE
  mqttClient.on("message", (topic, message) => {
    handleEspMessageFromMqtt(topic, message);
  });
}

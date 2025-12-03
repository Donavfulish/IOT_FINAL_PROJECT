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
}

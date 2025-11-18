let mqttClientRef = null;
let wssRef = null;

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
export const sendCommandToDevice = (command) => {
  if (!mqttClientRef || !wssRef) throw new Error("MQTT or WS not initialized");

  const payload = JSON.stringify({ command });
  mqttClientRef.publish("044153414/trashbin/web", payload);

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
  console.log("ESP → Service:", data);

  if (!wssRef) return;

  wssRef.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ event: "esp_update", message: data }));
    }
  });
};

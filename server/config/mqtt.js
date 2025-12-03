import mqtt from "mqtt";
import { handleReceivingMqttMessage } from "../controllers/device.controller.js";
const TOPIC_SUBSCRIBE = "044153414/smartbin/device";
const mqttClient = mqtt.connect("mqtt://test.mosquitto.org"); //mqtt://test.mosquitto.org || mqtt://broker.hivemq.com

mqttClient.on("connect", () => {
  console.log("MQTT connected");
  mqttClient.subscribe(`${TOPIC_SUBSCRIBE}/temp`);
  mqttClient.subscribe(`${TOPIC_SUBSCRIBE}/ultra`);
  mqttClient.subscribe(`${TOPIC_SUBSCRIBE}/button`);
});

mqttClient.on("error", (error) => {
  console.error("MQTT Error:", error);
});

mqttClient.on("message", (topic, message) => {
  const device = topic.split("/").pop();
  const data = message.toString();

  handleReceivingMqttMessage(device, data);
});

export default mqttClient;

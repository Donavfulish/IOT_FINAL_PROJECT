import mqtt from "mqtt";
import { handleEspMessageFromMqtt } from "../services/device.services.js";
const TOPIC_SUBSCRIBE = "044153414/smartbin/device";
const mqttClient = mqtt.connect("mqtt://broker.hivemq.com");

mqttClient.on("connect", () => {
  console.log("MQTT connected");
  mqttClient.subscribe(`${TOPIC_SUBSCRIBE}/temp`);
  mqttClient.subscribe(`${TOPIC_SUBSCRIBE}/ultra`);
  mqttClient.subscribe(`${TOPIC_SUBSCRIBE}/button`);
});

//mqttClient.on("message", handleEspMessageFromMqtt);

mqttClient.on("error", (error) => {
  console.error("MQTT Error:", error);
});

export default mqttClient;

import mqtt from "mqtt";
import deviceServices from "../controllers/device.controllers.js";
const TOPIC_SUBSCRIBE = "044153414/smartbin/device";

const clientId = "mqtt_backend_" + process.pid;
const mqttClient = mqtt.connect("mqtt://test.mosquitto.org", {
  clientId: clientId,
  reconnectPeriod: 5000, // Thử kết nối lại sau 5 giây nếu bị mất kết nối
}); //mqtt://test.mosquitto.org || mqtt://broker.hivemq.com

const subscribeTopics = () => {
  // Luôn đặt logic đăng ký (subscribe) bên trong sự kiện 'connect'
  mqttClient.subscribe(`${TOPIC_SUBSCRIBE}/temp`, (err) => {
    if (!err) console.log("Subscribed to temp");
  });
  mqttClient.subscribe(`${TOPIC_SUBSCRIBE}/ultra`, (err) => {
    if (!err) console.log("Subscribed to ultra");
  });
  mqttClient.subscribe(`${TOPIC_SUBSCRIBE}/button`, (err) => {
    if (!err) console.log("Subscribed to button");
  });
};

mqttClient.on("connect", () => {
  console.log("MQTT connected");
  subscribeTopics();
});

mqttClient.on("message", (topic, message) => {
  console.log("MQTT Received:", topic);
  const device = topic.split("/").pop();

  // "[binID]/[message]"
  const payloadElements = message.toString().split("/");
  const binId = parseInt(payloadElements[0]);
  const data = payloadElements[1];

  deviceServices.handleReceivingMqttMessage(binId, device, data);
});

mqttClient.on("error", (error) => {
  console.error("MQTT Error:", error);
});

mqttClient.on("disconnect", () => {
  console.log("MQTT DISCONNECTED!");
});

export default mqttClient;

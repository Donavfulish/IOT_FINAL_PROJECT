import mqtt from "mqtt";
const TOPIC_SUBSCRIBE = "044153414/smartbin/device";
const mqttClient = mqtt.connect("mqtt://broker.hivemq.com");

mqttClient.on("connect", () => {
  console.log("MQTT connected");
  mqttClient.subscribe(`${TOPIC_SUBSCRIBE}/temp`);
  mqttClient.subscribe(`${TOPIC_SUBSCRIBE}/ultra`);
  mqttClient.subscribe(`${TOPIC_SUBSCRIBE}/button`);
});

export default mqttClient;

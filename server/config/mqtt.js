import mqtt from "mqtt";

const mqttClient = mqtt.connect("mqtt://broker.hivemq.com");

mqttClient.on("connect", () => {
  console.log("MQTT connected");
  mqttClient.subscribe("044153414/trashbin/device");
});

export default mqttClient;

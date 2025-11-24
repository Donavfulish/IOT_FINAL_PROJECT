import http from "http";
import app from "./app.js";
import initWebSocket from "./config/websocket.js";
import mqttClient from "./config/mqtt.js";
import "./config/db.js";
const server = http.createServer(app);

// Init websocket server
initWebSocket(server, mqttClient);

// Start HTTP
server.listen(4000, () => {
  console.log("Server running at http://localhost:4000");
});

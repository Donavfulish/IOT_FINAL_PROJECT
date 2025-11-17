const express = require("express")
const WebSocket = require("ws")
const mqtt = require("mqtt")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())

// HTTP server
const server = app.listen(4000, () => {
    console.log("Server running on port 4000")
})

// WS server → giao tiếp với Frontend
const wss = new WebSocket.Server({ server })

wss.on("connection", (ws) => {
    console.log("Frontend connected")

    ws.send("Hello Frontend! Backend says hi.")
    
    ws.on("message", (msg) => {
        console.log("WS → MQTT:", msg.toString())

        // Publish xuống ESP qua MQTT
        mqttClient.publish("044153414/trashbin/web", msg.toString())
    })
})


// MQTT client → giao tiếp với ESP
const mqttClient = mqtt.connect("mqtt://broker.hivemq.com")

mqttClient.on("connect", () => {
    console.log("MQTT connected")

    // Subscribe để nhận dữ liệu từ ESP
    mqttClient.subscribe("044153414/trashbin/device")
})


// Khi nhận dữ liệu từ ESP → đẩy qua WebSocket cho Frontend
mqttClient.on("message", (topic, msg) => {
    console.log("MQTT → WS:", topic, msg.toString())

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(msg.toString())
        }
    })
})

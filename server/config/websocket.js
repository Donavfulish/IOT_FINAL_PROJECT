import WebSocket from "ws";

export let ws = null;

export function initWebSocket(server) {
  ws = new WebSocket.Server({ server });
  ws.on("close", (code, reason) => {
    console.log(
      `WS Client disconnected. Code: ${code}, Reason: ${reason.toString()}`
    );
  });

  ws.on("error", (err) => {
    console.error("WS Client connection error:", err);
    ws.close();
  });
}

import WebSocket from "ws";

export let wss = null;

/* eslint-disable no-console */
export function initWebSocket(server) {
  wss = new WebSocket.Server({ server });
}

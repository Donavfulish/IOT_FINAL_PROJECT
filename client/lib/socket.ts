export const createSocket = (): WebSocket => {
  let socket: WebSocket = new WebSocket("ws://localhost:4000");

  socket.onopen = () => console.log("WS connected");
  socket.onclose = () => console.log("WS closed");
  socket.onerror = (e) => console.error("WS error:", e);

  return socket;
};

export const cleanSocket = (socket: WebSocket) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.close();
  }
};

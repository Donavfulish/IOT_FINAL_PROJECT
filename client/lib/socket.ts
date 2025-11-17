let socket: WebSocket | null = null

export const initSocket = () => {
  if (!socket) {
    socket = new WebSocket("ws://localhost:4000")
  }

  socket.onopen = () => console.log("WS connected")
  socket.onclose = () => console.log("WS closed")

  return socket
}

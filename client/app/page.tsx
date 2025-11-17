"use client"
import { useEffect, useState } from "react"
import { initSocket } from "@/lib/socket"

export default function Home() {
  const [msg, setMsg] = useState("")

  useEffect(() => {
    const ws = initSocket()
    ws.onmessage = (e) => setMsg(e.data)
  }, [])

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">WebSocket Test</h1>
      <p className="mt-2">Message from server: {msg}</p>
    </div>
  )
}

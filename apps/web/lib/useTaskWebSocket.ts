"use client"
import { useEffect, useRef } from 'react'

/**
 * Connects to the backend WebSocket and calls `onEvent` whenever
 * a task-related broadcast is received. Auto-reconnects on drop.
 * If the socket fails, nothing breaks — the page just won't auto-refresh.
 */
export function useTaskWebSocket(onEvent: (data: any) => void) {
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    function connect() {
      try {
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000'
        const ws = new WebSocket(`${wsUrl}/ws/tasks`)

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            onEvent(data)
          } catch {
            // ignore non-JSON messages
          }
        }

        ws.onclose = () => {
          // Auto-reconnect after 3 seconds
          reconnectTimer.current = setTimeout(connect, 3000)
        }

        ws.onerror = () => {
          ws.close()
        }

        wsRef.current = ws
      } catch {
        // WebSocket not available — fail silently
      }
    }

    connect()

    return () => {
      clearTimeout(reconnectTimer.current)
      wsRef.current?.close()
    }
  }, []) // intentionally stable — onEvent is called via closure
}

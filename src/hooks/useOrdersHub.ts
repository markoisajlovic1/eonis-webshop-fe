import { useEffect, useRef } from 'react'
import * as signalR from '@microsoft/signalr'
import { authService } from '../services/authService'

export interface OrderCreatedPayload {
  orderId: string
  userId: string | null
  createdAt: string
  isPaid: boolean
  status: number
  addressId: string
}

export const useOrdersHub = (
  enabled: boolean,
  onOrderCreated: (payload: OrderCreatedPayload) => void
) => {
  const handlerRef = useRef(onOrderCreated)
  handlerRef.current = onOrderCreated

  useEffect(() => {
    if (!enabled) return

    const token = authService.getToken()
    if (!token) return

    // Svaki effect ciklus dobija svoj ID da znamo koji je "aktivan"
    const effectId = Math.random().toString(36).slice(2, 6)
    let active = true

    console.log(`[SignalR:${effectId}] Starting`)

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_BASE_URL}/hubs/orders`, {
        accessTokenFactory: () => authService.getToken() ?? '',
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(signalR.LogLevel.Warning)
      .build()

    connection.on('OrderCreated', (payload: OrderCreatedPayload) => {
      if (!active) {
        console.log(`[SignalR:${effectId}] Received event but inactive, ignoring`)
        return
      }
      console.log(`[SignalR:${effectId}] ✅ OrderCreated:`, payload)
      handlerRef.current(payload)
    })

    ;(window as any).__signalr = connection

    connection
      .start()
      .then(() => {
        if (!active) {
          console.log(`[SignalR:${effectId}] Started but already inactive, stopping`)
          connection.stop()
          return
        }
        console.log(`[SignalR:${effectId}] ✅ Connected, ID:`, connection.connectionId)
      })
      .catch(err => {
        if (active) console.error(`[SignalR:${effectId}] ❌ Failed:`, err)
      })

    return () => {
      active = false
      console.log(`[SignalR:${effectId}] Cleanup, stopping`)
      connection.stop()
    }
  }, [enabled])
}
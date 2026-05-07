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
  const connectionRef = useRef<signalR.HubConnection | null>(null)
  const handlerRef = useRef(onOrderCreated)
  handlerRef.current = onOrderCreated

  useEffect(() => {
    if (!enabled) return

    const token = authService.getToken()
    console.log('[SignalR] token at connect time:', token ? token.slice(0, 20) + '...' : 'NULL')
    if (!token) return

    if (connectionRef.current) return

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_BASE_URL}/hubs/orders?access_token=${token}`, {
        transport: signalR.HttpTransportType.WebSockets,
        skipNegotiation: true,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build()

    connectionRef.current = connection

    const handler = (payload: OrderCreatedPayload) => handlerRef.current(payload)
    connection.on('OrderCreated', handler)

    connection.start()
      .then(() => console.log('[SignalR] Connected'))
      .catch(err => console.error('[SignalR] Connection failed:', err))

    return () => {
      connection.off('OrderCreated', handler)
      connection.stop()
      connectionRef.current = null
    }
  }, [enabled])
}

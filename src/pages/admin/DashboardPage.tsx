import { useState, useEffect, useMemo, useCallback } from 'react'
import { FiShoppingBag, FiDollarSign, FiAward, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { useOrdersHub } from '../../hooks/useOrdersHub'
import type { OrderCreatedPayload } from '../../hooks/useOrdersHub'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store/store'
import { Role } from '../../types/auth'
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { statsService } from '../../services/statsService'
import { orderService } from '../../services/orderService'
import type { DashboardStatsDTO, DailyStatsDTO } from '../../types/stats'
import type { OrderFilterDTO } from '../../types/order'
import { ORDER_STATUS_LABELS } from '../../types/order'
import { MONTH_NAMES } from '../../constants/monthNames'
import * as signalR from '@microsoft/signalr'

const fmt = (n: number) => n.toLocaleString('sr-RS')
const fmtDate = (s: string) => new Date(s).toLocaleDateString('sr-RS', { day: '2-digit', month: '2-digit', year: 'numeric' })

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-neutral-200 rounded-xl shadow-lg p-3 text-xs flex flex-col gap-1.5 min-w-40">
      <p className="font-semibold text-neutral-700 mb-0.5">{label}. u mesecu</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="font-medium text-neutral-800">
            {p.name === 'Prihod' ? `${fmt(p.value)} RSD` : p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

const DashboardPage = () => {
  const now = new Date()
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth())
  const [dashboard, setDashboard] = useState<DashboardStatsDTO | null>(null)
  const [chartData, setChartData] = useState<DailyStatsDTO[]>([])
  const [chartLoading, setChartLoading] = useState(true)
  const [latestOrders, setLatestOrders] = useState<OrderFilterDTO[]>([])

  const role = useSelector((state: RootState) => state.auth.role)
  const initializing = useSelector((state: RootState) => state.auth.initializing)
  const isEmployee = !initializing && role === Role.Employee

  const handleOrderCreated = useCallback((payload: OrderCreatedPayload) => {
    const time = new Date(payload.createdAt).toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' })
    toast.info(
      <div className="flex flex-col gap-0.5">
        <span className="font-semibold text-sm">Nova porudžbina primljena!</span>
        <span className="text-xs text-neutral-500 font-mono">{payload.orderId.slice(0, 8)}...</span>
        <span className="text-xs text-neutral-500">{payload.isPaid ? 'Plaćeno' : 'Nije plaćeno'} · {time}</span>
      </div>,
      { autoClose: 6000 }
    )
    statsService.getDashboard().then(setDashboard).catch(console.error)
    const newOrder: OrderFilterDTO = {
      orderId: payload.orderId,
      userId: payload.userId,
      username: null,
      date: payload.createdAt,
      couponCode: null,
      addressId: payload.addressId,
      status: payload.status as OrderFilterDTO['status'],
      isPaid: payload.isPaid,
    }
    setLatestOrders(prev => [newOrder, ...prev].slice(0, 5))
  }, [])

  // useOrdersHub(isEmployee, handleOrderCreated)

  useEffect(() => {
  if (!isEmployee) return

  const token = localStorage.getItem('token')

  if (!token) return

  const connection = new signalR.HubConnectionBuilder()
    .withUrl('https://localhost:5001/hubs/orders', {
      accessTokenFactory: () => token
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build()

  connection.on('OrderCreated', (payload: OrderCreatedPayload) => {
    handleOrderCreated(payload)
  })

  const start = async () => {
    try {
      await connection.start()

      console.log('OrdersHub connected')
    } catch (err) {
      console.error('SignalR connection failed:', err)
    }
  }

  start()

  return () => {
    connection.stop()
  }
}, [isEmployee, handleOrderCreated])

  useEffect(() => {
    statsService.getDashboard().then(setDashboard).catch(console.error)
    orderService.getLatest().then(setLatestOrders).catch(console.error)
  }, [])

  useEffect(() => {
    let cancelled = false
    setChartLoading(true)
    const from = new Date(selectedYear, selectedMonth, 1)
    const to = new Date(selectedYear, selectedMonth + 1, 0)
    statsService.getDateRange(from, to)
      .then(data => { if (!cancelled) setChartData(data) })
      .catch(console.error)
      .finally(() => { if (!cancelled) setChartLoading(false) })
    return () => { cancelled = true }
  }, [selectedYear, selectedMonth])

  const statsCards = useMemo(() => [
    {
      label: 'Prodaje danas',
      value: dashboard ? String(dashboard.todaySales.total) : '—',
      icon: <FiShoppingBag className="text-xl text-amber-500" />,
      bg: 'bg-amber-50',
    },
    {
      label: 'Prihod danas',
      value: dashboard ? `${fmt(dashboard.todayRevenue)} RSD` : '—',
      icon: <FiDollarSign className="text-xl text-green-500" />,
      bg: 'bg-green-50',
    },
    {
      label: 'Najprodavaniji',
      value: dashboard?.bestSellingProduct?.productName ?? '—',
      icon: <FiAward className="text-xl text-blue-500" />,
      bg: 'bg-blue-50',
    },
    {
      label: 'Prihod od početka meseca',
      value: dashboard ? `${fmt(dashboard.monthRevenue)} RSD` : '—',
      icon: <FiAward className="text-xl text-purple-500" />,
      bg: 'bg-purple-50',
    },
  ], [dashboard])

  const displayData = useMemo(() =>
    chartData.map(d => ({
      day: String(new Date(d.date).getDate()),
      prihod: d.profit,
      paidOrders: d.paidOrders,
      unpaidOrders: d.unpaidOrders,
    })),
    [chartData]
  )



  // hendlovanje meseca
  const isCurrentMonth = selectedYear === now.getFullYear() && selectedMonth === now.getMonth()

  const handlePrev = () => {
    if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(y => y - 1) }
    else setSelectedMonth(m => m - 1)
  }

  const handleNext = () => {
    if (isCurrentMonth) return
    if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(y => y + 1) }
    else setSelectedMonth(m => m + 1)
  }

  return (
    <div className="p-8 flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-800">Zdravo, Marko</h1>
        <span className="text-sm text-gray-400">Pregled aktivnosti za danas</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6">
        {statsCards.map((card) => (
          <div key={card.label} className="bg-white border border-neutral-100 rounded-xl p-6 flex items-center gap-4">
            <div className={`${card.bg} p-3 rounded-xl`}>
              {card.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 font-light">{card.label}</span>
              <span className="text-lg font-semibold text-neutral-800">{card.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white border border-neutral-100 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-semibold text-neutral-700">Prihod i porudžbine po danu</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors cursor-pointer"
            >
              <FiChevronLeft size={16} />
            </button>
            <span className="text-sm font-medium text-neutral-700 min-w-27.5 text-center">
              {MONTH_NAMES[selectedMonth]} {selectedYear}
            </span>
            <button
              onClick={handleNext}
              disabled={isCurrentMonth}
              className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>

        {chartLoading ? (
          <div className="h-75 flex items-center justify-center text-sm text-gray-400">Učitavanje...</div>
        ) : displayData.length === 0 ? (
          <div className="h-75 flex items-center justify-center text-sm text-gray-400">Nema podataka za ovaj mesec</div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={displayData} margin={{ top: 0, right: 0, left: 10, bottom: 0 }} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={false}
                interval={displayData.length > 28 ? 2 : 1}
              />
              <YAxis
                yAxisId="revenue"
                orientation="left"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <YAxis
                yAxisId="orders"
                orientation="right"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 16 }} />
              <Bar yAxisId="revenue" dataKey="prihod" name="Prihod" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={14} />
              <Bar yAxisId="orders" dataKey="paidOrders" name="Plaćene" stackId="orders" fill="#22c55e" radius={[0, 0, 0, 0]} maxBarSize={14} />
              <Bar yAxisId="orders" dataKey="unpaidOrders" name="Neplaćene" stackId="orders" fill="#fca5a5" radius={[4, 4, 0, 0]} maxBarSize={14} />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Latest Orders */}
      <div className="bg-white border border-neutral-100 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-neutral-700 mb-4">Poslednje porudžbine</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-400 border-b border-neutral-100">
              <th className="pb-3 font-medium">ID</th>
              <th className="pb-3 font-medium">Korisnik</th>
              <th className="pb-3 font-medium">Datum</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Plaćeno</th>
            </tr>
          </thead>
          <tbody>
            {latestOrders.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-400 italic font-light">Nema porudžbina</td>
              </tr>
            ) : (
              latestOrders.map(order => (
                <tr key={order.orderId} className="border-b border-neutral-50 last:border-0">
                  <td className="py-3.5 font-mono text-xs text-neutral-400">{order.orderId.slice(0, 8)}...</td>
                  <td className="py-3.5 font-medium text-neutral-800">{order.username ?? 'Guest'}</td>
                  <td className="py-3.5 text-neutral-500">{fmtDate(order.date)}</td>
                  <td className="py-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${order.status === 2 ? 'bg-green-50 text-green-700' :
                        order.status === 1 ? 'bg-blue-50 text-blue-700' :
                        'bg-amber-50 text-amber-700'}`}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${order.isPaid ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                      {order.isPaid ? 'Da' : 'Ne'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DashboardPage

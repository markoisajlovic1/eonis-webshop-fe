import { FiShoppingBag, FiDollarSign, FiAward } from 'react-icons/fi'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const statsCards = [
  {
    label: 'Prodaje danas',
    value: '24',
    icon: <FiShoppingBag className="text-xl text-amber-500" />,
    bg: 'bg-amber-50',
  },
  {
    label: 'Prihod danas',
    value: '142.800 RSD',
    icon: <FiDollarSign className="text-xl text-green-500" />,
    bg: 'bg-green-50',
  },
  {
    label: 'Najprodavaniji',
    value: 'Nike Air Max 90',
    icon: <FiAward className="text-xl text-blue-500" />,
    bg: 'bg-blue-50',
  },
  {
    label: 'Prihod od pocetka meseca',
    value: '2.356.000 RSD',
    icon: <FiAward className="text-xl text-blue-500" />,
    bg: 'bg-blue-50',
  },
]

const revenueData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date()
  date.setDate(date.getDate() - (29 - i))
  return {
    date: date.toLocaleDateString('sr-RS', { day: '2-digit', month: '2-digit' }),
    prihod: Math.floor(Math.random() * 150000) + 30000,
  }
})

const recentSales = [
  { id: '#00124', customer: 'Ana Petrović', product: 'Nike Air Max 90', amount: '18.500 RSD', status: 'Isporučeno' },
  { id: '#00123', customer: 'Milan Đorđević', product: 'Adidas Ultraboost 22', amount: '22.900 RSD', status: 'U toku' },
  { id: '#00122', customer: 'Jelena Nikolić', product: 'Puma RS-X', amount: '12.400 RSD', status: 'Isporučeno' },
  { id: '#00121', customer: 'Stefan Marković', product: 'New Balance 574', amount: '15.200 RSD', status: 'Otkazano' },
  { id: '#00120', customer: 'Ivana Jovanović', product: 'Reebok Classic', amount: '9.800 RSD', status: 'Isporučeno' },
]

const statusStyle: Record<string, string> = {
  'Isporučeno': 'bg-green-100 text-green-700',
  'U toku': 'bg-amber-100 text-amber-700',
  'Otkazano': 'bg-red-100 text-red-600',
}

const DashboardPage = () => {
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
        <h2 className="text-sm font-semibold text-neutral-700 mb-6">Prihod — poslednjih 30 dana</h2>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={revenueData} margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrihod" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
              interval={4}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value) => [`${Number(value).toLocaleString('sr-RS')} RSD`, 'Prihod']}
              contentStyle={{ borderRadius: 8, border: '1px solid #f3f4f6', fontSize: 12 }}
            />
            <Area
              type="monotone"
              dataKey="prihod"
              stroke="#f59e0b"
              strokeWidth={2}
              fill="url(#colorPrihod)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Sales */}
      <div className="bg-white border border-neutral-100 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-neutral-700 mb-4">Poslednje prodaje</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-400 border-b border-neutral-100">
              <th className="pb-3 font-medium">Narudžbina</th>
              <th className="pb-3 font-medium">Kupac</th>
              <th className="pb-3 font-medium">Proizvod</th>
              <th className="pb-3 font-medium">Iznos</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentSales.map((sale) => (
              <tr key={sale.id} className="border-b border-neutral-50 last:border-0">
                <td className="py-3.5 text-gray-500 font-mono">{sale.id}</td>
                <td className="py-3.5 font-medium text-neutral-800">{sale.customer}</td>
                <td className="py-3.5 text-gray-500">{sale.product}</td>
                <td className="py-3.5 font-semibold text-neutral-800">{sale.amount}</td>
                <td className="py-3.5">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle[sale.status]}`}>
                    {sale.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DashboardPage

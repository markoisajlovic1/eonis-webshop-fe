export interface TodaySalesDTO {
  total: number
  paid: number
  unpaid: number
}

export interface BestSellingProductDTO {
  productId: string
  productName: string
  orderItemCount: number
}

export interface DashboardStatsDTO {
  todayRevenue: number
  monthRevenue: number
  todaySales: TodaySalesDTO
  bestSellingProduct: BestSellingProductDTO | null
}

export interface DailyStatsDTO {
  date: string
  profit: number
  totalOrders: number
  paidOrders: number
  unpaidOrders: number
}

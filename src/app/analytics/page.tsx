"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, DollarSign, Package, Eye, ShoppingCart, Calendar, Target } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { Header } from "@/components/header"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface InventoryItem {
  id: string
  title: string
  description: string
  price: number
  msrp: number
  category: string
  condition: string
  brand: string
  model: string
  color: string
  size: string
  weight: string
  dimensions: string
  image: string
  dateAdded: string
  status: "draft" | "listed" | "sold"
}

export default function Analytics() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [timeRange, setTimeRange] = useState("30d")

  useEffect(() => {
    const savedItems = localStorage.getItem("powerListerItems")
    if (savedItems) {
      setItems(JSON.parse(savedItems))
    }
  }, [])

  // Calculate analytics data
  const analytics = {
    totalItems: items.length,
    listedItems: items.filter((item) => item.status === "listed").length,
    soldItems: items.filter((item) => item.status === "sold").length,
    draftItems: items.filter((item) => item.status === "draft").length,
    totalValue: items.reduce((sum, item) => sum + item.price, 0),
    soldValue: items.filter((item) => item.status === "sold").reduce((sum, item) => sum + item.price, 0),
    avgPrice: items.length > 0 ? items.reduce((sum, item) => sum + item.price, 0) / items.length : 0,
    conversionRate: items.length > 0 ? (items.filter((item) => item.status === "sold").length / items.length) * 100 : 0,
  }

  // Sample data for charts
  const salesData = [
    { name: "Jan", sales: 4000, revenue: 2400, items: 24 },
    { name: "Feb", sales: 3000, revenue: 1398, items: 22 },
    { name: "Mar", sales: 2000, revenue: 9800, items: 29 },
    { name: "Apr", sales: 2780, revenue: 3908, items: 20 },
    { name: "May", sales: 1890, revenue: 4800, items: 21 },
    { name: "Jun", sales: 2390, revenue: 3800, items: 25 },
    { name: "Jul", sales: 3490, revenue: 4300, items: 31 },
  ]

  const categoryData = [
    { name: "Electronics", value: 45, color: "#10b981" },
    { name: "Footwear", value: 25, color: "#ef4444" },
    { name: "Clothing", value: 15, color: "#f59e0b" },
    { name: "Accessories", value: 10, color: "#8b5cf6" },
    { name: "Other", value: 5, color: "#6b7280" },
  ]

  const performanceData = [
    { name: "Week 1", views: 120, listings: 8, sales: 3 },
    { name: "Week 2", views: 150, listings: 12, sales: 5 },
    { name: "Week 3", views: 180, listings: 10, sales: 4 },
    { name: "Week 4", views: 200, listings: 15, sales: 7 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header />

      <main className="px-4 pt-6 pb-24 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Analytics
            </h1>
            <p className="text-slate-400">Track your inventory performance and insights</p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 bg-slate-800/50 border-slate-700 text-white focus:border-emerald-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="7d" className="text-white hover:bg-slate-700">
                Last 7 days
              </SelectItem>
              <SelectItem value="30d" className="text-white hover:bg-slate-700">
                Last 30 days
              </SelectItem>
              <SelectItem value="90d" className="text-white hover:bg-slate-700">
                Last 90 days
              </SelectItem>
              <SelectItem value="1y" className="text-white hover:bg-slate-700">
                Last year
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-0 shadow-xl shadow-emerald-500/25">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Total Revenue</p>
                  <p className="text-white text-2xl font-bold">${analytics.soldValue.toLocaleString()}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-emerald-200" />
                    <span className="text-emerald-200 text-xs">+12.5%</span>
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-emerald-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-xl shadow-blue-500/25">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Items Sold</p>
                  <p className="text-white text-2xl font-bold">{analytics.soldItems}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-blue-200" />
                    <span className="text-blue-200 text-xs">+8.2%</span>
                  </div>
                </div>
                <ShoppingCart className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 shadow-xl shadow-purple-500/25">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Avg. Price</p>
                  <p className="text-white text-2xl font-bold">${analytics.avgPrice.toFixed(0)}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingDown className="h-3 w-3 text-purple-200" />
                    <span className="text-purple-200 text-xs">-2.1%</span>
                  </div>
                </div>
                <Target className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500 to-amber-600 border-0 shadow-xl shadow-amber-500/25">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm font-medium">Conversion Rate</p>
                  <p className="text-white text-2xl font-bold">{analytics.conversionRate.toFixed(1)}%</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-amber-200" />
                    <span className="text-amber-200 text-xs">+5.3%</span>
                  </div>
                </div>
                <Eye className="h-8 w-8 text-amber-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Trend */}
          <Card className="border-0 shadow-xl bg-slate-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
                Revenue Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                      color: "#f1f5f9",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card className="border-0 shadow-xl bg-slate-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Package className="h-5 w-5 text-blue-400" />
                Category Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                      color: "#f1f5f9",
                    }}
                  />
                  <Legend wrapperStyle={{ color: "#f1f5f9" }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card className="mb-8 border-0 shadow-xl bg-slate-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="h-5 w-5 text-purple-400" />
              Weekly Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                    color: "#f1f5f9",
                  }}
                />
                <Legend wrapperStyle={{ color: "#f1f5f9" }} />
                <Bar dataKey="views" fill="#3b82f6" name="Views" radius={[4, 4, 0, 0]} />
                <Bar dataKey="listings" fill="#10b981" name="Listings" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sales" fill="#ef4444" name="Sales" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-emerald-900/30 to-emerald-800/30 border border-emerald-800/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Top Performer</h3>
                  <p className="text-sm text-emerald-300">Electronics category</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 mb-3">
                Electronics items have the highest conversion rate at 65% and generate 45% of total revenue.
              </p>
              <Badge className="bg-emerald-500 text-white border-0 shadow-lg">+15% this month</Badge>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-amber-900/30 to-amber-800/30 border border-amber-800/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Opportunity</h3>
                  <p className="text-sm text-amber-300">Pricing optimization</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 mb-3">
                Items priced 10-15% below MSRP sell 40% faster than higher-priced items.
              </p>
              <Badge className="bg-amber-500 text-white border-0 shadow-lg">Action needed</Badge>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-900/30 to-blue-800/30 border border-blue-800/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Best Time</h3>
                  <p className="text-sm text-blue-300">To list items</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 mb-3">
                Items listed on weekends get 25% more views and sell 18% faster.
              </p>
              <Badge className="bg-blue-500 text-white border-0 shadow-lg">Weekend boost</Badge>
            </CardContent>
          </Card>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}

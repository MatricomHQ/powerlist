"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image" // Import Image component
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Package, TrendingUp, DollarSign, Eye, Grid3X3, List, BarChart3 } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { Header } from "@/components/header"

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

export default function Dashboard() {
  const router = useRouter()
  const [items, setItems] = useState<InventoryItem[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  useEffect(() => {
    // Check if user is logged in (simple check for demo)
    const isLoggedIn = localStorage.getItem("powerListerLoggedIn")
    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    // Load items from localStorage
    const savedItems = localStorage.getItem("powerListerItems")
    if (savedItems) {
      setItems(JSON.parse(savedItems))
    } else {
      // Demo data with realistic descriptions
      const demoItems: InventoryItem[] = [
        {
          id: "1",
          title: "iPhone 14 Pro Max",
          description:
            "Premium smartphone with advanced camera system, A16 Bionic chip, and stunning display. Perfect for photography enthusiasts and power users.",
          price: 899,
          msrp: 1099,
          category: "Electronics",
          condition: "Excellent",
          brand: "Apple",
          model: "iPhone 14 Pro Max",
          color: "Deep Purple",
          size: '6.7"',
          weight: "240g",
          dimensions: "6.33 × 3.05 × 0.31 in",
          image: "/placeholder.svg",
          dateAdded: "2024-01-15",
          status: "listed",
        },
        {
          id: "2",
          title: "Nike Air Jordan 1 Retro",
          description:
            "Classic basketball sneakers with iconic design and premium materials. A timeless addition to any sneaker collection with authentic styling.",
          price: 180,
          msrp: 170,
          category: "Footwear",
          condition: "Good",
          brand: "Nike",
          model: "Air Jordan 1 Retro",
          color: "White/Black/Red",
          size: "10",
          weight: "1.2 lbs",
          dimensions: "12 × 8 × 5 in",
          image: "/placeholder.svg",
          dateAdded: "2024-01-14",
          status: "sold",
        },
        {
          id: "3",
          title: 'MacBook Pro 16" M2',
          description:
            "Powerful laptop with M2 chip delivering exceptional performance for creative professionals. Features stunning Retina display and all-day battery life.",
          price: 2199,
          msrp: 2499,
          category: "Electronics",
          condition: "Like New",
          brand: "Apple",
          model: 'MacBook Pro 16"',
          color: "Space Gray",
          size: '16"',
          weight: "4.7 lbs",
          dimensions: "14.01 × 9.77 × 0.66 in",
          image: "/placeholder.svg",
          dateAdded: "2024-01-13",
          status: "draft",
        },
      ]
      setItems(demoItems)
      localStorage.setItem("powerListerItems", JSON.stringify(demoItems))
    }
  }, [router])

  const stats = {
    totalItems: items.length,
    listedItems: items.filter((item) => item.status === "listed").length,
    soldItems: items.filter((item) => item.status === "sold").length,
    draftItems: items.filter((item) => item.status === "draft").length,
    totalValue: items.reduce((sum, item) => sum + item.price, 0),
    soldValue: items.filter((item) => item.status === "sold").reduce((sum, item) => sum + item.price, 0),
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sold":
        return "bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-lg shadow-red-500/25"
      case "listed":
        return "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0 shadow-lg shadow-emerald-500/25"
      case "draft":
        return "bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 shadow-lg shadow-amber-500/25"
      default:
        return "bg-slate-600 text-white border-0"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header />

      <main className="px-4 pt-6 pb-24 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-slate-400">Here's what's happening with your inventory</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-0 shadow-xl shadow-emerald-500/25">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Total Value</p>
                  <p className="text-white text-2xl font-bold">${stats.totalValue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-emerald-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 border-0 shadow-xl shadow-red-500/25">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">Sold Value</p>
                  <p className="text-white text-2xl font-bold">${stats.soldValue.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-red-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-xl shadow-blue-500/25">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Items</p>
                  <p className="text-white text-2xl font-bold">{stats.totalItems}</p>
                </div>
                <Package className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 shadow-xl shadow-purple-500/25">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Listed</p>
                  <p className="text-white text-2xl font-bold">{stats.listedItems}</p>
                </div>
                <Eye className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() => router.push("/add-item")}
              className="h-20 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-xl shadow-emerald-500/25 border-0 transition-all duration-300 hover:scale-105"
            >
              <div className="flex flex-col items-center gap-2">
                <Camera className="h-6 w-6" />
                <span className="text-sm font-medium">Add Item</span>
              </div>
            </Button>

            <Button
              onClick={() => router.push("/inventory")}
              className="h-20 bg-slate-800/50 border-2 border-slate-700/50 hover:border-slate-600 hover:bg-slate-700/50 text-slate-200 hover:text-white transition-all duration-300 hover:scale-105"
            >
              <div className="flex flex-col items-center gap-2">
                <Package className="h-6 w-6" />
                <span className="text-sm font-medium">Inventory</span>
              </div>
            </Button>

            <Button
              onClick={() => router.push("/analytics")}
              className="h-20 bg-slate-800/50 border-2 border-slate-700/50 hover:border-slate-600 hover:bg-slate-700/50 text-slate-200 hover:text-white transition-all duration-300 hover:scale-105"
            >
              <div className="flex flex-col items-center gap-2">
                <BarChart3 className="h-6 w-6" />
                <span className="text-sm font-medium">Analytics</span>
              </div>
            </Button>

            <Button
              onClick={() => router.push("/profile")}
              className="h-20 bg-slate-800/50 border-2 border-slate-700/50 hover:border-slate-600 hover:bg-slate-700/50 text-slate-200 hover:text-white transition-all duration-300 hover:scale-105"
            >
              <div className="flex flex-col items-center gap-2">
                <TrendingUp className="h-6 w-6" />
                <span className="text-sm font-medium">Profile</span>
              </div>
            </Button>
          </div>
        </div>

        {/* Recent Items */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Recent Items</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                className="border-slate-700 bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700/50"
              >
                {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.slice(0, 6).map((item) => (
                <div key={item.id} onClick={() => router.push(`/item/${item.id}`)} className="cursor-pointer">
                  <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-xl bg-slate-800/50 backdrop-blur-sm hover:bg-slate-700/50">
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          width={300} // A fixed width
                          height={192} // A fixed height (48 * 4) for the 48 height on img
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <Badge className={`absolute top-3 right-3 ${getStatusColor(item.status)}`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-white mb-1 line-clamp-1">{item.title}</h3>
                        <p className="text-slate-400 text-sm mb-3 line-clamp-2">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-emerald-400">${item.price}</span>
                            {item.msrp > item.price && (
                              <span className="text-sm text-slate-500 line-through">${item.msrp}</span>
                            )}
                          </div>
                          <Badge className="bg-slate-700/50 text-slate-300 border-slate-600 text-xs">
                            {item.category}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {items.slice(0, 6).map((item) => (
                <div key={item.id} onClick={() => router.push(`/item/${item.id}`)} className="cursor-pointer">
                  <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-slate-800/50 backdrop-blur-sm hover:bg-slate-700/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          width={80} // Corresponds to w-20
                          height={80} // Corresponds to h-20
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-white truncate">{item.title}</h3>
                            <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                          </div>
                          <p className="text-slate-400 text-sm truncate mb-1">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-emerald-400">${item.price}</span>
                            <Badge className="bg-slate-700/50 text-slate-300 border-slate-600 text-xs">
                              {item.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 6 && (
          <div className="text-center">
            <Button
              onClick={() => router.push("/inventory")}
              className="bg-slate-800/50 border-2 border-slate-700/50 hover:border-slate-600 hover:bg-slate-700/50 text-slate-200 hover:text-white"
            >
              View All Items
            </Button>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
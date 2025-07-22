"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Grid3X3, List, Plus } from "lucide-react"
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

export default function Inventory() {
  const router = useRouter()
  const [items, setItems] = useState<InventoryItem[]>([])
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  useEffect(() => {
    // Load items from localStorage
    const savedItems = localStorage.getItem("powerListerItems")
    if (savedItems) {
      const parsedItems = JSON.parse(savedItems)
      setItems(parsedItems)
      setFilteredItems(parsedItems)
    }
  }, [])

  useEffect(() => {
    // Filter items based on search and filters
    let filtered = items

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.brand.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter)
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((item) => item.category === categoryFilter)
    }

    setFilteredItems(filtered)
  }, [items, searchQuery, statusFilter, categoryFilter])

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

  const getStatusStats = () => {
    return {
      all: items.length,
      draft: items.filter((item) => item.status === "draft").length,
      listed: items.filter((item) => item.status === "listed").length,
      sold: items.filter((item) => item.status === "sold").length,
    }
  }

  const stats = getStatusStats()
  const categories = [...new Set(items.map((item) => item.category))].filter(Boolean)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header />

      <main className="px-4 pt-6 pb-24 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Inventory
            </h1>
            <p className="text-slate-400">{filteredItems.length} items found</p>
          </div>
          <Button
            onClick={() => router.push("/add-item")}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-xl shadow-emerald-500/25"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { key: "all", label: "All Items", count: stats.all, color: "bg-slate-700/50 text-slate-300" },
            { key: "draft", label: "Drafts", count: stats.draft, color: "bg-amber-900/30 text-amber-300" },
            { key: "listed", label: "Listed", count: stats.listed, color: "bg-emerald-900/30 text-emerald-300" },
            { key: "sold", label: "Sold", count: stats.sold, color: "bg-red-900/30 text-red-300" },
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={statusFilter === tab.key ? "default" : "outline"}
              onClick={() => setStatusFilter(tab.key)}
              className={`whitespace-nowrap ${
                statusFilter === tab.key
                  ? "bg-gradient-to-r from-slate-700 to-slate-600 text-white shadow-lg"
                  : "border-slate-700 bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              {tab.label}
              <Badge className={`ml-2 ${tab.color} border-0`}>{tab.count}</Badge>
            </Button>
          ))}
        </div>

        {/* Search and Filters */}
        <Card className="mb-6 border-0 shadow-xl bg-slate-800/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40 bg-slate-900/50 border-slate-700 text-white focus:border-emerald-500">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all" className="text-white hover:bg-slate-700">
                      All Categories
                    </SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category} className="text-white hover:bg-slate-700">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                  className="border-slate-700 bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700/50"
                >
                  {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items Grid/List */}
        {filteredItems.length === 0 ? (
          <Card className="border-0 shadow-xl bg-slate-800/50 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-slate-700 to-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No items found</h3>
              <p className="text-slate-400 mb-4">
                {searchQuery || statusFilter !== "all" || categoryFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Start by adding your first item to inventory"}
              </p>
              <Button
                onClick={() => router.push("/add-item")}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Item
              </Button>
            </CardContent>
          </Card>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} onClick={() => router.push(`/item/${item.id}`)} className="cursor-pointer">
                <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-xl bg-slate-800/50 backdrop-blur-sm hover:bg-slate-700/50">
                  {/* Remove the hover opacity effects from action buttons since we're going mobile-first */}
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className={`absolute top-3 right-3 ${getStatusColor(item.status)}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-white mb-1 line-clamp-1">{item.title}</h3>
                      <p className="text-slate-400 text-sm mb-3 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between mb-2">
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
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{item.condition}</span>
                        <span>{new Date(item.dateAdded).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div key={item.id} onClick={() => router.push(`/item/${item.id}`)} className="cursor-pointer">
                <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-slate-800/50 backdrop-blur-sm hover:bg-slate-700/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white truncate">{item.title}</h3>
                          <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                        </div>
                        <p className="text-slate-400 text-sm truncate mb-2">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className="text-lg font-bold text-emerald-400">${item.price}</span>
                            <Badge className="bg-slate-700/50 text-slate-300 border-slate-600 text-xs">
                              {item.category}
                            </Badge>
                            <span className="text-xs text-slate-500">{item.condition}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}

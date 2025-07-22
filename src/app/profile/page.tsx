"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, MapPin, Calendar, Star, Package, DollarSign, TrendingUp, Edit, Settings, LogOut } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { Header } from "@/components/header"
import { MarketplaceSetup } from "@/components/marketplace-setup"

interface UserProfile {
  name: string
  email: string
  phone: string
  location: string
  avatar: string
  joinDate: string
  totalSales: number
  totalListings: number
  rating: number
}

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

export default function Profile() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile>({
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    avatar: "/placeholder.svg",
    joinDate: "2023-06-15",
    totalSales: 0,
    totalListings: 0,
    rating: 4.8,
  })

  const [items, setItems] = useState<InventoryItem[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [showMarketplaceSetup, setShowMarketplaceSetup] = useState(false)

  useEffect(() => {
    // Load items from localStorage
    const savedItems = localStorage.getItem("powerListerItems")
    if (savedItems) {
      const parsedItems = JSON.parse(savedItems)
      setItems(parsedItems)

      // Update profile stats
      const soldItems = parsedItems.filter((item: InventoryItem) => item.status === "sold")
      const totalSales = soldItems.reduce((sum: number, item: InventoryItem) => sum + item.price, 0)

      setProfile((prev) => ({
        ...prev,
        totalSales,
        totalListings: parsedItems.length,
      }))
    }

    // Load profile from localStorage
    const savedProfile = localStorage.getItem("powerListerProfile")
    if (savedProfile) {
      setProfile((prev) => ({ ...prev, ...JSON.parse(savedProfile) }))
    }
  }, [])

  const handleSaveProfile = () => {
    localStorage.setItem("powerListerProfile", JSON.stringify(profile))
    setIsEditing(false)
  }

  const handleSignOut = () => {
    // Clear login flag
    localStorage.removeItem("powerListerLoggedIn")
    // Redirect to login page
    router.push("/login")
  }

  const stats = {
    totalItems: items.length,
    soldItems: items.filter((item) => item.status === "sold").length,
    listedItems: items.filter((item) => item.status === "listed").length,
    draftItems: items.filter((item) => item.status === "draft").length,
    totalRevenue: items.filter((item) => item.status === "sold").reduce((sum, item) => sum + item.price, 0),
    avgSalePrice:
      items.filter((item) => item.status === "sold").length > 0
        ? items.filter((item) => item.status === "sold").reduce((sum, item) => sum + item.price, 0) /
          items.filter((item) => item.status === "sold").length
        : 0,
  }

  const achievements = [
    { title: "First Sale", description: "Completed your first sale", earned: stats.soldItems > 0, icon: "🎉" },
    { title: "Power Seller", description: "Sold 10+ items", earned: stats.soldItems >= 10, icon: "⚡" },
    { title: "Inventory Master", description: "Listed 25+ items", earned: stats.totalItems >= 25, icon: "📦" },
    { title: "Revenue Milestone", description: "Earned $1,000+", earned: stats.totalRevenue >= 1000, icon: "💰" },
    { title: "Quick Seller", description: "Sold item within 24 hours", earned: false, icon: "⚡" },
    { title: "Category Expert", description: "Specialized in one category", earned: false, icon: "🎯" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header />

      <main className="px-4 pt-6 pb-24 max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-8 border-0 shadow-xl bg-slate-800/50 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar className="w-24 h-24 ring-4 ring-emerald-500/20">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback className="text-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">
                  {profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-white">{profile.name}</h1>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-amber-400 fill-current" />
                    <span className="text-sm font-medium text-slate-300">{profile.rating}</span>
                    <span className="text-sm text-slate-500">({stats.soldItems} sales)</span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 text-sm text-slate-400 mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {profile.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {profile.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Joined {new Date(profile.joinDate).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-emerald-900/30 text-emerald-300 border-emerald-800/50">
                    {stats.soldItems} Sales
                  </Badge>
                  <Badge className="bg-blue-900/30 text-blue-300 border-blue-800/50">{stats.totalItems} Items</Badge>
                  <Badge className="bg-purple-900/30 text-purple-300 border-purple-800/50">
                    ${stats.totalRevenue.toLocaleString()} Revenue
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  className="border-2 border-slate-700 bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700/50"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                <Button className="border-2 border-slate-700 bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700/50">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        {isEditing && (
          <Card className="mb-8 border-0 shadow-xl bg-slate-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Edit Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-slate-300">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                    className="mt-1 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-slate-300">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                    className="mt-1 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-slate-300">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
                    className="mt-1 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <Label htmlFor="location" className="text-slate-300">
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => setProfile((prev) => ({ ...prev, location: e.target.value }))}
                    className="mt-1 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleSaveProfile}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg"
                >
                  Save Changes
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  className="border-slate-700 bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700/50"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-0 shadow-xl shadow-emerald-500/25">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Total Revenue</p>
                  <p className="text-white text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
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
                  <p className="text-white text-2xl font-bold">{stats.soldItems}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 shadow-xl shadow-purple-500/25">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Total Items</p>
                  <p className="text-white text-2xl font-bold">{stats.totalItems}</p>
                </div>
                <Package className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500 to-amber-600 border-0 shadow-xl shadow-amber-500/25">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm font-medium">Avg. Sale</p>
                  <p className="text-white text-2xl font-bold">${stats.avgSalePrice.toFixed(0)}</p>
                </div>
                <Star className="h-8 w-8 text-amber-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <Card className="mb-8 border-0 shadow-xl bg-slate-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Star className="h-5 w-5 text-amber-400" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    achievement.earned
                      ? "bg-gradient-to-br from-emerald-900/30 to-emerald-800/30 border-emerald-700/50 shadow-lg shadow-emerald-500/10"
                      : "bg-slate-900/30 border-slate-700/50"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <h3 className={`font-semibold ${achievement.earned ? "text-emerald-300" : "text-slate-400"}`}>
                        {achievement.title}
                      </h3>
                      {achievement.earned && (
                        <Badge className="bg-emerald-500 text-white border-0 text-xs shadow-lg">Earned</Badge>
                      )}
                    </div>
                  </div>
                  <p className={`text-sm ${achievement.earned ? "text-emerald-400" : "text-slate-500"}`}>
                    {achievement.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Marketplace Setup */}
        {showMarketplaceSetup ? (
          <div className="mb-8">
            <MarketplaceSetup onClose={() => setShowMarketplaceSetup(false)} />
          </div>
        ) : (
          <Card className="mb-8 border-0 shadow-xl bg-slate-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Settings className="h-5 w-5 text-blue-400" />
                Marketplace Connections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-slate-900/30 rounded-lg border border-slate-700/50">
                <div>
                  <h3 className="font-medium text-white">Connect Marketplaces</h3>
                  <p className="text-sm text-slate-400">Set up automatic posting to eBay, Facebook, and more</p>
                </div>
                <Button
                  onClick={() => setShowMarketplaceSetup(true)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg"
                >
                  Setup
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Account Actions */}
        <Card className="border-0 shadow-xl bg-slate-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-900/30 rounded-lg border border-slate-700/50">
              <div>
                <h3 className="font-medium text-white">Notifications</h3>
                <p className="text-sm text-slate-400">Manage your notification preferences</p>
              </div>
              <Button
                size="sm"
                className="border-slate-700 bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700/50"
              >
                Configure
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-900/30 rounded-lg border border-slate-700/50">
              <div>
                <h3 className="font-medium text-white">Privacy Settings</h3>
                <p className="text-sm text-slate-400">Control your data and privacy</p>
              </div>
              <Button
                size="sm"
                className="border-slate-700 bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700/50"
              >
                Manage
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-900/30 rounded-lg border border-slate-700/50">
              <div>
                <h3 className="font-medium text-white">Export Data</h3>
                <p className="text-sm text-slate-400">Download your inventory data</p>
              </div>
              <Button
                size="sm"
                className="border-slate-700 bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700/50"
              >
                Export
              </Button>
            </div>

            <div className="pt-4 border-t border-slate-700">
              <Button
                onClick={handleSignOut}
                className="w-full text-red-400 border-red-800/50 hover:bg-red-900/20 bg-slate-900/30"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  )
}
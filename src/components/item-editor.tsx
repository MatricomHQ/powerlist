"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Save, Eye, ArrowLeft } from "lucide-react"
import { theme, marketplaces } from "@/lib/theme"

interface ItemForm {
  title: string
  description: string
  price: string
  msrp: string
  category: string
  condition: string
  brand: string
  model: string
  color: string
  size: string
  weight: string
  dimensions: string
  image: string
}

interface ItemEditorProps {
  initialData?: Partial<ItemForm>
  imageUrl?: string
  onSave: (data: ItemForm, status: "draft" | "listed") => void
  onBack: () => void
  isAIEnhanced?: boolean
}

export function ItemEditor({ initialData, imageUrl, onSave, onBack, isAIEnhanced = false }: ItemEditorProps) {
  const [form, setForm] = useState<ItemForm>({
    title: "",
    description: "",
    price: "",
    msrp: "",
    category: "",
    condition: "",
    brand: "",
    model: "",
    color: "",
    size: "",
    weight: "",
    dimensions: "",
    image: imageUrl || "",
    ...initialData,
  })

  const [connectedMarketplaces] = useState(["ebay", "facebook"]) // Mock connected marketplaces

  const categories = [
    "Electronics",
    "Footwear",
    "Clothing",
    "Accessories",
    "Home & Garden",
    "Sports & Outdoors",
    "Books",
    "Toys & Games",
    "Automotive",
    "Other",
  ]

  const conditions = ["New", "Like New", "Excellent", "Good", "Fair", "Poor"]

  const handlePostToMarketplace = (marketplaceId: string) => {
    // Handle marketplace posting
    console.log(`Posting to ${marketplaceId}`)
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.background.primary}`}>
      <main className={theme.layout.container}>
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={onBack} className={`p-2 ${theme.colors.button.ghost}`}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className={`text-2xl font-bold ${theme.colors.text.primary}`}>
              {initialData?.title ? "Edit Item" : "Add New Item"}
            </h1>
            <p className={theme.colors.text.muted}>Configure your item details and marketplace listings</p>
          </div>
        </div>

        {/* Item Preview */}
        <Card className={`mb-6 ${theme.layout.card}`}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Item Image */}
              <div className="md:w-1/3">
                <img
                  src={form.image || "/placeholder.svg"}
                  alt={form.title || "Product"}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>

              {/* Item Info */}
              <div className="md:w-2/3">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className={`text-xl font-bold ${theme.colors.text.primary}`}>{form.title || "Item Title"}</h2>
                  {isAIEnhanced && (
                    <Badge
                      className={`${theme.colors.status.success.bg} text-white border-0 ${theme.effects.shadow.button}`}
                    >
                      AI Enhanced
                    </Badge>
                  )}
                </div>
                <p className={`${theme.colors.text.secondary} mb-4`}>
                  {form.description || "Item description will appear here"}
                </p>
                <div className="flex items-center gap-4 mb-4">
                  <span className={`text-2xl font-bold ${theme.colors.status.success.text}`}>${form.price || "0"}</span>
                  {form.msrp && Number(form.msrp) > Number(form.price) && (
                    <span className={`text-lg ${theme.colors.text.disabled} line-through`}>${form.msrp}</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Marketplace Posting */}
        <Card className={`mb-6 ${theme.layout.card}`}>
          <CardHeader>
            <CardTitle className={theme.colors.text.primary}>Post to Marketplaces</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {marketplaces.map((marketplace) => {
                const isConnected = connectedMarketplaces.includes(marketplace.id)
                const themeKey = marketplace.id as keyof typeof theme.colors.marketplace
                const marketplaceTheme = theme.colors.marketplace[themeKey] || theme.colors.marketplace.ebay

                return (
                  <Button
                    key={marketplace.id}
                    onClick={() => handlePostToMarketplace(marketplace.id)}
                    disabled={!isConnected || !form.title || !form.price}
                    className={`h-auto p-4 flex flex-col items-center gap-2 ${
                      isConnected
                        ? `${marketplaceTheme.bg} ${marketplaceTheme.hover} ${marketplaceTheme.shadow} text-white`
                        : theme.colors.button.secondary
                    } ${theme.effects.transition}`}
                  >
                    <span className="text-2xl">{marketplace.icon}</span>
                    <div className="text-center">
                      <div className="font-medium">{marketplace.name}</div>
                      <div className="text-xs opacity-80">{isConnected ? "Ready to post" : "Setup required"}</div>
                    </div>
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Item Details Form */}
        <Card className={theme.layout.card}>
          <CardHeader>
            <CardTitle className={theme.colors.text.primary}>Item Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className={theme.colors.text.secondary}>
                  Product Title *
                </Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter product title"
                  className={`mt-1 ${theme.colors.background.input} ${theme.colors.border.primary} ${theme.colors.text.primary} placeholder:${theme.colors.text.disabled} ${theme.colors.border.focus}`}
                />
              </div>

              <div>
                <Label htmlFor="description" className={theme.colors.text.secondary}>
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the product condition, features, etc."
                  className={`mt-1 min-h-[100px] ${theme.colors.background.input} ${theme.colors.border.primary} ${theme.colors.text.primary} placeholder:${theme.colors.text.disabled} ${theme.colors.border.focus}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price" className={theme.colors.text.secondary}>
                    Selling Price *
                  </Label>
                  <div className="relative mt-1">
                    <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.colors.text.disabled}`}>$</span>
                    <Input
                      id="price"
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                      placeholder="0.00"
                      className={`pl-8 ${theme.colors.background.input} ${theme.colors.border.primary} ${theme.colors.text.primary} placeholder:${theme.colors.text.disabled} ${theme.colors.border.focus}`}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="msrp" className={theme.colors.text.secondary}>
                    MSRP
                  </Label>
                  <div className="relative mt-1">
                    <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.colors.text.disabled}`}>$</span>
                    <Input
                      id="msrp"
                      type="number"
                      value={form.msrp}
                      onChange={(e) => setForm((prev) => ({ ...prev, msrp: e.target.value }))}
                      placeholder="0.00"
                      className={`pl-8 ${theme.colors.background.input} ${theme.colors.border.primary} ${theme.colors.text.primary} placeholder:${theme.colors.text.disabled} ${theme.colors.border.focus}`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category" className={theme.colors.text.secondary}>
                    Category *
                  </Label>
                  <Select
                    value={form.category}
                    onValueChange={(value) => setForm((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger
                      className={`mt-1 ${theme.colors.background.input} ${theme.colors.border.primary} ${theme.colors.text.primary} ${theme.colors.border.focus}`}
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className={`${theme.colors.background.card} ${theme.colors.border.primary}`}>
                      {categories.map((category) => (
                        <SelectItem
                          key={category}
                          value={category}
                          className={`${theme.colors.text.primary} hover:${theme.colors.background.cardHover}`}
                        >
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="condition" className={theme.colors.text.secondary}>
                    Condition *
                  </Label>
                  <Select
                    value={form.condition}
                    onValueChange={(value) => setForm((prev) => ({ ...prev, condition: value }))}
                  >
                    <SelectTrigger
                      className={`mt-1 ${theme.colors.background.input} ${theme.colors.border.primary} ${theme.colors.text.primary} ${theme.colors.border.focus}`}
                    >
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent className={`${theme.colors.background.card} ${theme.colors.border.primary}`}>
                      {conditions.map((condition) => (
                        <SelectItem
                          key={condition}
                          value={condition}
                          className={`${theme.colors.text.primary} hover:${theme.colors.background.cardHover}`}
                        >
                          {condition}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Product Specifications */}
            <div className="space-y-4">
              <h3 className={`font-semibold ${theme.colors.text.primary} border-b ${theme.colors.border.primary} pb-2`}>
                Product Specifications
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brand" className={theme.colors.text.secondary}>
                    Brand
                  </Label>
                  <Input
                    id="brand"
                    value={form.brand}
                    onChange={(e) => setForm((prev) => ({ ...prev, brand: e.target.value }))}
                    placeholder="e.g., Apple, Nike"
                    className={`mt-1 ${theme.colors.background.input} ${theme.colors.border.primary} ${theme.colors.text.primary} placeholder:${theme.colors.text.disabled} ${theme.colors.border.focus}`}
                  />
                </div>

                <div>
                  <Label htmlFor="model" className={theme.colors.text.secondary}>
                    Model
                  </Label>
                  <Input
                    id="model"
                    value={form.model}
                    onChange={(e) => setForm((prev) => ({ ...prev, model: e.target.value }))}
                    placeholder="e.g., iPhone 14 Pro"
                    className={`mt-1 ${theme.colors.background.input} ${theme.colors.border.primary} ${theme.colors.text.primary} placeholder:${theme.colors.text.disabled} ${theme.colors.border.focus}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="color" className={theme.colors.text.secondary}>
                    Color
                  </Label>
                  <Input
                    id="color"
                    value={form.color}
                    onChange={(e) => setForm((prev) => ({ ...prev, color: e.target.value }))}
                    placeholder="e.g., Deep Purple"
                    className={`mt-1 ${theme.colors.background.input} ${theme.colors.border.primary} ${theme.colors.text.primary} placeholder:${theme.colors.text.disabled} ${theme.colors.border.focus}`}
                  />
                </div>

                <div>
                  <Label htmlFor="size" className={theme.colors.text.secondary}>
                    Size
                  </Label>
                  <Input
                    id="size"
                    value={form.size}
                    onChange={(e) => setForm((prev) => ({ ...prev, size: e.target.value }))}
                    placeholder="e.g., Large, 10, 6.1 inch"
                    className={`mt-1 ${theme.colors.background.input} ${theme.colors.border.primary} ${theme.colors.text.primary} placeholder:${theme.colors.text.disabled} ${theme.colors.border.focus}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight" className={theme.colors.text.secondary}>
                    Weight
                  </Label>
                  <Input
                    id="weight"
                    value={form.weight}
                    onChange={(e) => setForm((prev) => ({ ...prev, weight: e.target.value }))}
                    placeholder="e.g., 206g, 1.2 lbs"
                    className={`mt-1 ${theme.colors.background.input} ${theme.colors.border.primary} ${theme.colors.text.primary} placeholder:${theme.colors.text.disabled} ${theme.colors.border.focus}`}
                  />
                </div>

                <div>
                  <Label htmlFor="dimensions" className={theme.colors.text.secondary}>
                    Dimensions
                  </Label>
                  <Input
                    id="dimensions"
                    value={form.dimensions}
                    onChange={(e) => setForm((prev) => ({ ...prev, dimensions: e.target.value }))}
                    placeholder="e.g., 5.81 × 2.81 × 0.31 in"
                    className={`mt-1 ${theme.colors.background.input} ${theme.colors.border.primary} ${theme.colors.text.primary} placeholder:${theme.colors.text.disabled} ${theme.colors.border.focus}`}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => onSave(form, "draft")}
                className={`flex-1 ${theme.colors.button.secondary}`}
                disabled={!form.title || !form.category || !form.condition}
              >
                <Save className="h-4 w-4 mr-2" />
                Save as Draft
              </Button>
              <Button
                onClick={() => onSave(form, "listed")}
                className={`flex-1 ${theme.colors.button.primary}`}
                disabled={!form.title || !form.price || !form.category || !form.condition}
              >
                <Eye className="h-4 w-4 mr-2" />
                List Item
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
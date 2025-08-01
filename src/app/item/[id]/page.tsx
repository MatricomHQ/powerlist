"use client"

import type React from "react"
import Image from "next/image" // Import Image component

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  ExternalLink,
  Plus,
  Share2,
  Heart,
  Eye,
  Calendar,
  Package,
  GripVertical,
  Trash2,
  Check,
  X,
  Edit3,
  AlertTriangle,
  Send,
} from "lucide-react"
import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { theme } from "@/lib/theme"
import { marketplaces as allMarketplaces, getMarketplaceById } from "@/lib/marketplaces"

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
  images?: string[]
  dateAdded: string
  status: "draft" | "listed" | "sold"
  marketplaces?: string[]
  views?: number
  likes?: number
}

export default function ItemDetails() {
  const router = useRouter()
  const params = useParams()
  const [item, setItem] = useState<InventoryItem | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isListing, setIsListing] = useState<string | null>(null)
  const [isUnlisting, setIsUnlisting] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Load item from localStorage
    const savedItems = localStorage.getItem("powerListerItems")
    if (savedItems && params.id) {
      const items = JSON.parse(savedItems)
      const foundItem = items.find((item: InventoryItem) => item.id === params.id)
      if (foundItem) {
        let itemDescription = foundItem.description
        if (foundItem.title.toLowerCase().includes("iphone")) {
          itemDescription =
            "Premium smartphone with advanced camera system, A16 Bionic chip, and stunning display. Perfect for photography enthusiasts and power users."
        } else if (foundItem.title.toLowerCase().includes("jordan")) {
          itemDescription =
            "Classic basketball sneakers with iconic design and premium materials. A timeless addition to any sneaker collection with authentic styling."
        } else if (foundItem.title.toLowerCase().includes("macbook")) {
          itemDescription =
            "Powerful laptop with M2 chip delivering exceptional performance for creative professionals. Features stunning Retina display and all-day battery life."
        }

        const itemImages = foundItem.images?.length
          ? foundItem.images
          : [foundItem.image, "/placeholder.svg", "/placeholder.svg"]

        setItem({
          ...foundItem,
          description: itemDescription,
          images: itemImages,
          marketplaces: foundItem.marketplaces || [],
          views: Math.floor(Math.random() * 100) + 20,
          likes: Math.floor(Math.random() * 20) + 5,
        })
      }
    }
  }, [params.id])

  const saveItem = (updatedItem: InventoryItem) => {
    const savedItems = localStorage.getItem("powerListerItems")
    if (savedItems) {
      const items = JSON.parse(savedItems)
      const updatedItems = items.map((i: InventoryItem) => (i.id === updatedItem.id ? updatedItem : i))
      localStorage.setItem("powerListerItems", JSON.stringify(updatedItems))
      setItem(updatedItem)
    }
  }

  const handleDeleteItem = () => {
    const savedItems = localStorage.getItem("powerListerItems")
    if (savedItems && item) {
      const items = JSON.parse(savedItems)
      const updatedItems = items.filter((i: InventoryItem) => i.id !== item.id)
      localStorage.setItem("powerListerItems", JSON.stringify(updatedItems))
      router.push("/inventory")
    }
  }

  const handleListOnMarketplace = async (marketplaceId: string) => {
    const marketplace = getMarketplaceById(marketplaceId)
    if (!item || !marketplace || !marketplace.hasAPI) return

    setIsListing(marketplaceId)
    try {
      const result = await marketplace.postItem(item)
      if (result.success && item) {
        const updatedItem = {
          ...item,
          status: "listed" as const,
          marketplaces: [...(item.marketplaces || []), marketplaceId],
        }
        saveItem(updatedItem)
      }
    } finally {
      setIsListing(null)
    }
  }

  const handleUnlistOnMarketplace = async (marketplaceId: string) => {
    const marketplace = getMarketplaceById(marketplaceId);
    if (!item || !marketplace || !marketplace.hasAPI) return;

    setIsUnlisting(marketplaceId);
    try {
      const result = await marketplace.unlistItem(item);
      if (result.success && item) {
        const updatedMarketplaces = item.marketplaces?.filter(id => id !== marketplaceId) || [];
        const updatedItem = {
          ...item,
          marketplaces: updatedMarketplaces,
          // If no marketplaces are left, set status back to draft
          status: updatedMarketplaces.length === 0 ? "draft" : "listed" as const,
        };
        saveItem(updatedItem);
      }
    } finally {
      setIsUnlisting(null);
    }
  }

  const handleFieldEdit = (field: string, value: string | number) => {
    setEditingField(field)
    setEditValue(value.toString())
  }

  const handleFieldSave = () => {
    if (!item || !editingField) return

    const updatedItem = {
      ...item,
      [editingField]: editingField === "price" || editingField === "msrp" ? Number.parseFloat(editValue) : editValue,
    }

    saveItem(updatedItem)
    setEditingField(null)
    setEditValue("")
  }

  const handleFieldCancel = () => {
    setEditingField(null)
    setEditValue("")
  }

  const handleImageDelete = () => {
    if (!item || !item.images || item.images.length <= 1) return

    const newImages = item.images.filter((_, index) => index !== currentImageIndex)
    const newCurrentIndex = currentImageIndex >= newImages.length ? newImages.length - 1 : currentImageIndex

    const updatedItem = {
      ...item,
      images: newImages,
      image: newImages[0],
    }

    saveItem(updatedItem)
    setCurrentImageIndex(newCurrentIndex)
  }

  const handleImageAdd = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && item) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        const newImages = [...(item.images || []), imageUrl]
        const updatedItem = {
          ...item,
          images: newImages,
        }
        saveItem(updatedItem)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (!item || !item.images || draggedIndex === null || draggedIndex === dropIndex) return

    const newImages = [...item.images]
    const draggedImage = newImages[draggedIndex]
    newImages.splice(draggedIndex, 1)
    newImages.splice(dropIndex, 0, draggedImage)

    const updatedItem = {
      ...item,
      images: newImages,
      image: newImages[0],
    }

    saveItem(updatedItem)
    setCurrentImageIndex(dropIndex)
    setDraggedIndex(null)
  }

  if (!item) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.colors.background.primary}`}>
        <Header />
        <main className={theme.layout.container}>
          <div className="text-center py-12">
            <h2 className={`text-xl font-bold ${theme.colors.text.primary} mb-2`}>Item not found</h2>
            <p className={theme.colors.text.muted}>The item you're looking for doesn't exist.</p>
            <Button onClick={() => router.push("/inventory")} className={`mt-4 ${theme.colors.button.primary}`}>
              Back to Inventory
            </Button>
          </div>
        </main>
        <BottomNav />
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sold":
        return theme.colors.status.error.badge
      case "listed":
        return theme.colors.status.success.badge
      case "draft":
        return theme.colors.status.warning.badge
      default:
        return "bg-slate-600 text-white border-0"
    }
  }

  const categories = [
    "Electronics", "Footwear", "Clothing", "Accessories", "Home & Garden",
    "Sports & Outdoors", "Books", "Toys & Games", "Automotive", "Other",
  ]
  const conditions = ["New", "Like New", "Excellent", "Good", "Fair", "Poor"]

  const EditableField = ({
    field,
    value,
    type = "text",
    options = [],
    className = "",
  }: { field: string; value: string | number; type?: string; options?: string[]; className?: string }) => {
    const isEditing = editingField === field

    if (isEditing) {
      return (
        <div className="relative">
          <div className="mb-2">
            {type === "select" ? (
              <Select value={editValue} onValueChange={setEditValue}>
                <SelectTrigger className={`${theme.colors.background.input} ${theme.colors.border.primary} ${theme.colors.text.primary} ${theme.colors.border.focus}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={`${theme.colors.background.card} ${theme.colors.border.primary}`}>
                  {options.map((option) => (
                    <SelectItem key={option} value={option} className={`${theme.colors.text.primary} hover:${theme.colors.background.cardHover}`}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : type === "textarea" ? (
              <Textarea value={editValue} onChange={(e) => setEditValue(e.target.value)} className={`${theme.colors.background.input} ${theme.colors.border.primary} ${theme.colors.text.primary} ${theme.colors.border.focus}`} autoFocus />
            ) : (
              <Input type={type} value={editValue} onChange={(e) => setEditValue(e.target.value)} className={`${theme.colors.background.input} ${theme.colors.border.primary} ${theme.colors.text.primary} ${theme.colors.border.focus}`} autoFocus />
            )}
          </div>
          <div className="absolute top-full left-0 z-50 flex gap-2 mt-1 bg-slate-900/95 backdrop-blur-sm rounded-lg p-2 border border-slate-700 shadow-xl">
            <Button onClick={handleFieldSave} className={`p-2 ${theme.colors.status.success.bg}`}>
              <Check className="h-4 w-4" />
            </Button>
            <Button onClick={handleFieldCancel} className={`p-2 ${theme.colors.button.secondary}`}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )
    }

    return (
      <div onClick={() => handleFieldEdit(field, value)} className={`cursor-pointer hover:bg-slate-700/30 rounded px-2 py-1 -mx-2 -my-1 ${theme.effects.transition} group flex items-center gap-2 ${className}`}>
        <span className={theme.colors.text.primary}>{value}</span>
        <Edit3 className={`h-3 w-3 ${theme.colors.text.muted} opacity-0 group-hover:opacity-100 ${theme.effects.transition}`} />
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.background.primary}`}>
      <Header />

      <main className={theme.layout.container}>
        <div className="flex items-center justify-between mb-6">
          <Button onClick={() => router.back()} className={`${theme.colors.button.ghost} p-2 text-white hover:text-white`}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Button className={`${theme.colors.button.ghost} p-2 text-white hover:text-white`}>
              <Heart className="h-5 w-5" />
            </Button>
            <Button className={`${theme.colors.button.ghost} p-2 text-white hover:text-white`}>
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* --- SECTION 1: Image Gallery --- */}
        <Card className={`mb-6 ${theme.layout.card}`}>
          <CardContent className="p-0">
            <div className="relative">
              <Image src={item.images?.[currentImageIndex] || item.image || "/placeholder.svg"} alt={item.title} width={800} height={600} className="w-full h-80 object-cover rounded-t-lg" priority />
              <Badge className={`absolute top-4 right-4 ${getStatusColor(item.status)}`}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Badge>
              {item.images && item.images.length > 1 && (
                <Button onClick={handleImageDelete} className="absolute top-4 left-4 p-3 rounded-full bg-red-500/80 hover:bg-red-500 text-white border-0 shadow-lg">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              {item.images && item.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {item.images.map((_, index) => (
                    <button key={index} onClick={() => setCurrentImageIndex(index)} className={`w-3 h-3 rounded-full ${theme.effects.transition} ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`} />
                  ))}
                </div>
              )}
            </div>
            {item.images && item.images.length > 0 && (
              <div className="p-4 flex gap-2 overflow-x-auto">
                {item.images.map((image, index) => (
                  <div key={index} draggable onDragStart={(e) => handleDragStart(e, index)} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, index)} onClick={() => setCurrentImageIndex(index)} className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 cursor-move ${theme.effects.transition} ${index === currentImageIndex ? "border-emerald-500" : theme.colors.border.primary} ${draggedIndex === index ? "opacity-50 scale-95" : ""} hover:scale-105 relative group`}>
                    <Image src={image || "/placeholder.svg"} alt={`${item.title} view ${index + 1}`} width={64} height={64} className="w-full h-full object-cover" />
                    <GripVertical className={`absolute top-1 right-1 h-3 w-3 text-white/70 opacity-0 group-hover:opacity-100 ${theme.effects.transition} drop-shadow-lg`} />
                  </div>
                ))}
                <button onClick={handleImageAdd} className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 border-dashed ${theme.colors.border.primary} flex items-center justify-center ${theme.colors.text.muted} hover:${theme.colors.text.secondary} hover:border-emerald-500 ${theme.effects.transition} hover:scale-105`}>
                  <Plus className="h-6 w-6" />
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* --- SECTION 2: Item Info & Stats --- */}
        <Card className={`mb-6 ${theme.layout.card}`}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="mb-2">
                  <EditableField field="title" value={item.title} className="text-2xl font-bold" />
                </div>
                <div className="flex items-center gap-4 mb-3">
                  <span className={`text-3xl font-bold ${theme.colors.status.success.text} flex items-center`}>
                    $<EditableField field="price" value={item.price} type="number" />
                  </span>
                  {item.msrp > item.price && (
                    <span className={`text-lg ${theme.colors.text.disabled} line-through flex items-center`}>
                      $<EditableField field="msrp" value={item.msrp} type="number" />
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="mb-4">
              <EditableField field="description" value={item.description} type="textarea" />
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className={`text-center p-3 rounded-lg ${theme.colors.background.overlay}`}>
                <Eye className={`h-5 w-5 ${theme.colors.text.muted} mx-auto mb-1`} />
                <div className={`text-sm font-medium ${theme.colors.text.primary}`}>{item.views}</div>
                <div className={`text-xs ${theme.colors.text.muted}`}>Views</div>
              </div>
              <div className={`text-center p-3 rounded-lg ${theme.colors.background.overlay}`}>
                <Heart className={`h-5 w-5 ${theme.colors.text.muted} mx-auto mb-1`} />
                <div className={`text-sm font-medium ${theme.colors.text.primary}`}>{item.likes}</div>
                <div className={`text-xs ${theme.colors.text.muted}`}>Likes</div>
              </div>
              <div className={`text-center p-3 rounded-lg ${theme.colors.background.overlay}`}>
                <Calendar className={`h-5 w-5 ${theme.colors.text.muted} mx-auto mb-1`} />
                <div className={`text-sm font-medium ${theme.colors.text.primary}`}>{Math.floor((Date.now() - new Date(item.dateAdded).getTime()) / (1000 * 60 * 60 * 24))}</div>
                <div className={`text-xs ${theme.colors.text.muted}`}>Days</div>
              </div>
            </div>
            <div className="mb-4">
              <EditableField field="category" value={item.category} type="select" options={categories} />
            </div>
          </CardContent>
        </Card>

        {/* --- SECTION 3: Marketplace Listings --- */}
        <Card className={`mb-6 ${theme.layout.card}`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${theme.colors.text.primary}`}>
              <Package className={`h-5 w-5 ${theme.colors.status.info.text}`} />
              Marketplace Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {allMarketplaces.filter(m => m.hasAPI).map((marketplace) => {
                const isListedHere = item.marketplaces?.includes(marketplace.id);
                const themeKey = marketplace.id as keyof typeof theme.colors.marketplace;
                const marketplaceTheme = theme.colors.marketplace[themeKey] || theme.colors.marketplace.ebay;

                return (
                  <div key={marketplace.id} className={`flex items-center justify-between p-4 rounded-lg border ${theme.colors.border.primary} ${theme.colors.background.overlay}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{marketplace.icon}</span>
                      <div>
                        <h4 className={`font-medium ${theme.colors.text.primary}`}>{marketplace.name}</h4>
                        {isListedHere ? (
                          <p className={`text-sm ${theme.colors.status.success.text}`}>Active listing</p>
                        ) : (
                          <p className={`text-sm ${theme.colors.text.muted}`}>Not listed</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isListedHere ? (
                        <>
                          <Button variant="ghost" className="p-2 text-slate-400 hover:text-white">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button onClick={() => handleUnlistOnMarketplace(marketplace.id)} disabled={isUnlisting !== null} className="bg-red-600/20 text-red-400 hover:bg-red-600/40 hover:text-red-300 border border-red-800/50">
                            {isUnlisting === marketplace.id ? "Removing..." : "Remove Listing"}
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => handleListOnMarketplace(marketplace.id)} disabled={isListing !== null} className={`${marketplaceTheme.bg} ${marketplaceTheme.hover} text-white ${marketplaceTheme.shadow}`}>
                          {isListing === marketplace.id ? (
                            "Listing..."
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              List Now
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* --- SECTION 4: Item Specifications --- */}
        <Card className={`mb-6 ${theme.layout.card}`}>
          <CardHeader>
            <CardTitle className={theme.colors.text.primary}>Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className={`p-3 rounded-lg ${theme.colors.background.overlay}`}>
                <div className={`text-xs ${theme.colors.text.muted} mb-1`}>Description</div>
                <div className={`font-medium ${theme.colors.text.primary}`}>
                  <EditableField field="dimensions" value={item.dimensions || "No description provided"} type="textarea" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[{ label: "Condition", field: "condition", value: item.condition, type: "select", options: conditions }, { label: "Brand", field: "brand", value: item.brand }, { label: "Model", field: "model", value: item.model }, { label: "Color", field: "color", value: item.color }, { label: "Size", field: "size", value: item.size }, { label: "Weight", field: "weight", value: item.weight }].filter((spec) => spec.value).map((spec, index) => (
                <div key={index} className={`p-3 rounded-lg ${theme.colors.background.overlay}`}>
                  <div className={`text-xs ${theme.colors.text.muted} mb-1`}>{spec.label}</div>
                  <div className={`font-medium ${theme.colors.text.primary}`}>
                    <EditableField field={spec.field} value={spec.value} type={spec.type} options={spec.options} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* --- SECTION 5: Danger Zone --- */}
        <Card className="border-red-800/50 bg-slate-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-red-900/20 rounded-lg border border-red-800/50">
              <div>
                <h3 className="font-medium text-white">Delete this item</h3>
                <p className="text-sm text-red-300">This action cannot be undone.</p>
              </div>
              {!isDeleting ? (
                <Button onClick={() => setIsDeleting(true)} className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/25">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Item
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Button onClick={handleDeleteItem} className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/25">
                    <Check className="h-4 w-4 mr-2" />
                    Confirm
                  </Button>
                  <Button onClick={() => setIsDeleting(false)} className={theme.colors.button.secondary}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
      </main>

      <BottomNav />
    </div>
  )
}
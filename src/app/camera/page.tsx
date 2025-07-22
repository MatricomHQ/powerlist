"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ImageIcon, X } from "lucide-react"
import { AnalyzingPopup } from "@/components/analyzing-popup"

interface AnalysisData {
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
}

export default function CameraView() {
  const router = useRouter()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleTakePhoto = () => {
    // Simulate taking a photo
    const mockImageUrl = "https://placehold.co/400x600/2d3748/ffffff?text=Captured"
    setCapturedImage(mockImageUrl)
    setIsAnalyzing(true)
  }

  const handleLibrarySelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        setCapturedImage(imageUrl)
        setIsAnalyzing(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAnalysisComplete = (analysisData: AnalysisData) => {
    // Set login flag
    localStorage.setItem("powerListerLoggedIn", "true")

    // Create new item and save directly to localStorage
    const newItem = {
      id: Date.now().toString(),
      ...analysisData,
      price: Number.parseFloat(analysisData.price) || 0,
      msrp: Number.parseFloat(analysisData.msrp) || 0,
      dateAdded: new Date().toISOString().split("T")[0],
      status: "draft" as const,
      image: capturedImage,
      images: [capturedImage],
    }

    // Save to localStorage
    const existingItems = JSON.parse(localStorage.getItem("powerListerItems") || "[]")
    const updatedItems = [...existingItems, newItem]
    localStorage.setItem("powerListerItems", JSON.stringify(updatedItems))

    // Navigate directly to the item view page
    router.push(`/item/${newItem.id}`)
  }

  return (
    <div className="min-h-screen relative">
      {/* Camera Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800">
        {/* Subtle texture pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, white 1px, transparent 1px),
              radial-gradient(circle at 75% 75%, white 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Close button */}
      <div className="absolute top-0 left-0 right-0 z-30 pt-12 px-6">
        <Button
          onClick={() => router.back()}
          className="p-3 rounded-full bg-black/60 backdrop-blur-sm border border-white/30 text-white hover:bg-black/80 transition-all duration-200"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      {/* Camera overlay elements */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/3 left-0 right-0 h-px bg-white" />
          <div className="absolute top-2/3 left-0 right-0 h-px bg-white" />
          <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white" />
          <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white" />
        </div>

        {/* Center focus indicator */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-24 h-24 border-2 border-white/70 rounded-lg relative">
            <div className="absolute -top-1 -left-1 w-6 h-6 border-l-3 border-t-3 border-white" />
            <div className="absolute -top-1 -right-1 w-6 h-6 border-r-3 border-t-3 border-white" />
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-l-3 border-b-3 border-white" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-r-3 border-b-3 border-white" />
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-30 pb-12 px-8">
        <div className="flex flex-col items-center space-y-6">
          {/* Capture Button */}
          <button
            onClick={handleTakePhoto}
            className="relative w-20 h-20 rounded-full bg-white border-4 border-white/50 hover:bg-white/95 transition-all duration-200 active:scale-95 shadow-2xl"
          >
            <div className="absolute inset-3 rounded-full bg-white border-2 border-gray-300 shadow-inner" />
          </button>

          {/* Library Button */}
          <Button
            onClick={handleLibrarySelect}
            className="flex items-center gap-3 px-8 py-4 rounded-full bg-black/70 backdrop-blur-sm border border-white/40 text-white hover:bg-black/90 transition-all duration-200 shadow-xl"
          >
            <ImageIcon className="h-5 w-5" />
            <span className="font-medium">Add from Library</span>
          </Button>
        </div>
      </div>

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

      {/* Analyzing Popup */}
      <AnalyzingPopup isOpen={isAnalyzing} onComplete={handleAnalysisComplete} />
    </div>
  )
}
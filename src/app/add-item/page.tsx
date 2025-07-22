"use client"

import { useState } from "react"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Upload, ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { AnalyzingPopup } from "@/components/analyzing-popup"
import { ItemEditor } from "@/components/item-editor"
import { theme } from "@/lib/theme"

type Step = "capture" | "analyzing" | "editing"

export default function AddItem() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>("capture")
  const [imageUrl, setImageUrl] = useState<string>("")
  const [analysisData, setAnalysisData] = useState<any>(null)

  useEffect(() => {
    // Redirect to camera view since that's now the primary flow
    router.replace("/camera")
  }, [router])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const url = e.target?.result as string
        setImageUrl(url)
        setCurrentStep("analyzing")
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAnalysisComplete = (data: any) => {
    setAnalysisData(data)
    setCurrentStep("editing")
  }

  const handleSaveItem = (formData: any, status: "draft" | "listed") => {
    const newItem = {
      id: Date.now().toString(),
      ...formData,
      price: Number.parseFloat(formData.price) || 0,
      msrp: Number.parseFloat(formData.msrp) || 0,
      dateAdded: new Date().toISOString().split("T")[0],
      status,
    }

    // Save to localStorage
    const existingItems = JSON.parse(localStorage.getItem("powerListerItems") || "[]")
    const updatedItems = [...existingItems, newItem]
    localStorage.setItem("powerListerItems", JSON.stringify(updatedItems))

    router.push("/")
  }

  const handleBack = () => {
    if (currentStep === "editing") {
      setCurrentStep("capture")
      setImageUrl("")
      setAnalysisData(null)
    } else {
      router.back()
    }
  }

  // Image Capture Screen
  if (currentStep === "capture") {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.colors.background.primary}`}>
        <Header />

        <main className={theme.layout.container}>
          <div className="flex items-center gap-3 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className={`p-2 ${theme.colors.button.ghost}`}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className={`text-2xl font-bold ${theme.colors.text.primary}`}>Add New Item</h1>
              <p className={theme.colors.text.muted}>Start by capturing or uploading a photo</p>
            </div>
          </div>

          <Card className={`${theme.layout.card} max-w-2xl mx-auto`}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${theme.colors.text.primary}`}>
                <Camera className={`h-5 w-5 ${theme.colors.status.success.text}`} />
                Product Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed ${theme.colors.border.dashed} rounded-lg p-12 text-center ${theme.colors.background.overlay}`}
              >
                <div className="flex flex-col items-center gap-6">
                  <div
                    className={`w-24 h-24 ${theme.colors.status.success.bg} rounded-full flex items-center justify-center ${theme.effects.shadow.button}`}
                  >
                    <Camera className="h-12 w-12 text-white" />
                  </div>

                  <div>
                    <h3 className={`text-xl font-semibold ${theme.colors.text.primary} mb-2`}>Capture Your Item</h3>
                    <p className={`${theme.colors.text.muted} mb-6 max-w-md`}>
                      Take a clear photo of your item or upload from your device. Our AI will analyze it and help you
                      create the perfect listing.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      className={`${theme.colors.button.primary} px-8 py-3 text-lg ${theme.effects.transition} ${theme.effects.hover.scale}`}
                      onClick={() => document.getElementById("camera-input")?.click()}
                    >
                      <Camera className="h-5 w-5 mr-3" />
                      Take Photo
                    </Button>

                    <label htmlFor="image-upload">
                      <Button
                        className={`${theme.colors.button.secondary} px-8 py-3 text-lg ${theme.effects.transition} ${theme.effects.hover.scale}`}
                        asChild
                      >
                        <span>
                          <Upload className="h-5 w-5 mr-3" />
                          Upload Image
                        </span>
                      </Button>
                    </label>
                  </div>

                  <input
                    id="camera-input"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </main>

        <BottomNav />
      </div>
    )
  }

  // Item Editor Screen
  if (currentStep === "editing") {
    return (
      <>
        <ItemEditor
          initialData={analysisData}
          imageUrl={imageUrl}
          onSave={handleSaveItem}
          onBack={handleBack}
          isAIEnhanced={!!analysisData}
        />
        <BottomNav />
      </>
    )
  }

  // Analyzing Screen (popup overlay)
  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.colors.background.primary}`}>
      <Header />
      <main className={theme.layout.container}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className={`${theme.colors.text.primary} text-center`}>
            <h2 className="text-2xl font-bold mb-4">Processing your image...</h2>
            <p className={theme.colors.text.muted}>Please wait while our AI analyzes your item</p>
          </div>
        </div>
      </main>
      <BottomNav />

      <AnalyzingPopup isOpen={currentStep === "analyzing"} onComplete={handleAnalysisComplete} />
    </div>
  )
}

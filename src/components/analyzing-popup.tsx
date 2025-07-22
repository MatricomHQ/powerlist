"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, CheckCircle } from "lucide-react"
import { theme } from "@/lib/theme"

interface AnalyzingPopupProps {
  isOpen: boolean
  onComplete: (analysisData: any) => void
}

export function AnalyzingPopup({ isOpen, onComplete }: AnalyzingPopupProps) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    "Analyzing image content...",
    "Identifying product details...",
    "Researching market prices...",
    "Generating description...",
    "Finalizing analysis...",
  ]

  useEffect(() => {
    if (!isOpen) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          // Simulate AI analysis completion
          setTimeout(() => {
            onComplete({
              title: "Apple iPhone 14 Pro",
              description:
                "Premium smartphone with advanced camera system and A16 Bionic chip. Features ProRAW photography and Cinematic mode.",
              price: "899",
              msrp: "999",
              category: "Electronics",
              condition: "Excellent",
              brand: "Apple",
              model: "iPhone 14 Pro",
              color: "Deep Purple",
              size: '6.1"',
              weight: "206g",
              dimensions: "5.81 × 2.81 × 0.31 in",
            })
          }, 500)
          return 100
        }
        return prev + 2
      })
    }, 100)

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length)
    }, 1200)

    return () => {
      clearInterval(interval)
      clearInterval(stepInterval)
    }
  }, [isOpen, onComplete])

  if (!isOpen) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${theme.colors.background.overlay} ${theme.effects.blur}`}
    >
      <Card className={`w-full max-w-md mx-4 ${theme.layout.card}`}>
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <div
              className={`w-16 h-16 ${theme.colors.status.success.bg} rounded-full flex items-center justify-center ${theme.effects.shadow.button}`}
            >
              {progress === 100 ? (
                <CheckCircle className="h-8 w-8 text-white" />
              ) : (
                <Sparkles className="h-8 w-8 text-white animate-spin" />
              )}
            </div>
          </div>

          <h3 className={`text-xl font-bold ${theme.colors.text.primary} mb-2`}>
            {progress === 100 ? "Analysis Complete!" : "Analyzing Item"}
          </h3>

          <p className={`${theme.colors.text.secondary} text-sm mb-6`}>
            {progress === 100 ? "AI has successfully analyzed your item" : steps[currentStep]}
          </p>

          <div className="space-y-3">
            <div className={`h-2 ${theme.colors.background.input} rounded-full overflow-hidden`}>
              <div
                className={`h-full ${theme.colors.status.success.bg} rounded-full ${theme.effects.transition}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className={`text-xs ${theme.colors.text.muted}`}>{progress}% complete</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

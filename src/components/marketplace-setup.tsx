"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Settings, ExternalLink } from "lucide-react"
import { theme } from "@/lib/theme"
import { marketplaces } from "@/lib/marketplaces" // Import from new module

interface MarketplaceSetupProps {
  onClose?: () => void
}

export function MarketplaceSetup({ onClose }: MarketplaceSetupProps) {
  const [connectedMarketplaces, setConnectedMarketplaces] = useState<string[]>(["ebay", "facebook"])
  const [setupMode, setSetupMode] = useState<string | null>(null)

  const handleConnect = (marketplaceId: string) => {
    if (connectedMarketplaces.includes(marketplaceId)) {
      setConnectedMarketplaces((prev) => prev.filter((id) => id !== marketplaceId))
    } else {
      setSetupMode(marketplaceId)
    }
  }

  const handleSetupComplete = (marketplaceId: string) => {
    setConnectedMarketplaces((prev) => [...prev, marketplaceId])
    setSetupMode(null)
  }

  if (setupMode) {
    const marketplace = marketplaces.find((m) => m.id === setupMode)
    if (!marketplace) return null

    return (
      <Card className={theme.layout.card}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${theme.colors.text.primary}`}>
            <span className="text-2xl">{marketplace.icon}</span>
            Connect {marketplace.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className={theme.colors.text.secondary}>
            Enter your {marketplace.name} API credentials to enable automatic posting.
          </p>

          <div className="space-y-4">
            <div>
              <Label htmlFor="api-key" className={theme.colors.text.secondary}>
                API Key
              </Label>
              <Input
                id="api-key"
                placeholder="Enter your API key"
                className={`mt-1 ${theme.colors.background.input} ${theme.colors.border.primary} ${theme.colors.text.primary} ${theme.colors.border.focus}`}
              />
            </div>

            <div>
              <Label htmlFor="api-secret" className={theme.colors.text.secondary}>
                API Secret
              </Label>
              <Input
                id="api-secret"
                type="password"
                placeholder="Enter your API secret"
                className={`mt-1 ${theme.colors.background.input} ${theme.colors.border.primary} ${theme.colors.text.primary} ${theme.colors.border.focus}`}
              />
            </div>

            <div className={`p-4 rounded-lg ${theme.colors.background.overlay} border ${theme.colors.border.primary}`}>
              <h4 className={`font-medium ${theme.colors.text.primary} mb-2`}>How to get your API credentials:</h4>
              <ol className={`text-sm ${theme.colors.text.secondary} space-y-1 list-decimal list-inside`}>
                <li>Go to {marketplace.name} Developer Center</li>
                <li>Create a new application</li>
                <li>Copy your API Key and Secret</li>
                <li>Paste them above</li>
              </ol>
              <Button variant="outline" size="sm" className={`mt-3 ${theme.colors.button.secondary}`}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Developer Center
              </Button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={() => handleSetupComplete(setupMode)} className={theme.colors.button.primary}>
              Connect {marketplace.name}
            </Button>
            <Button onClick={() => setSetupMode(null)} className={theme.colors.button.secondary}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={theme.layout.card}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${theme.colors.text.primary}`}>
          <Settings className={`h-5 w-5 ${theme.colors.status.info.text}`} />
          Marketplace Connections
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`${theme.colors.text.secondary} mb-6`}>
          Connect your marketplace accounts to automatically post your items across multiple platforms.
        </p>

        <div className="space-y-4">
          {marketplaces.map((marketplace) => {
            const isConnected = connectedMarketplaces.includes(marketplace.id)
            const themeKey = marketplace.id as keyof typeof theme.colors.marketplace
            const marketplaceTheme = theme.colors.marketplace[themeKey] || theme.colors.marketplace.ebay

            return (
              <div
                key={marketplace.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${theme.colors.border.primary} ${theme.colors.background.overlay}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{marketplace.icon}</span>
                  <div>
                    <h3 className={`font-medium ${theme.colors.text.primary}`}>{marketplace.name}</h3>
                    <p className={`text-sm ${theme.colors.text.muted}`}>{marketplace.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isConnected && (
                    <Badge className={`${theme.colors.status.success.badge} flex items-center gap-1`}>
                      <CheckCircle className="h-3 w-3" />
                      Connected
                    </Badge>
                  )}

                  <Button
                    onClick={() => handleConnect(marketplace.id)}
                    className={
                      isConnected
                        ? theme.colors.button.secondary
                        : marketplace.hasAPI
                          ? `${marketplaceTheme.bg} ${marketplaceTheme.hover} text-white ${marketplaceTheme.shadow}`
                          : theme.colors.button.secondary
                    }
                    disabled={!marketplace.hasAPI && !isConnected}
                  >
                    {isConnected ? "Disconnect" : marketplace.hasAPI ? "Connect" : "Coming Soon"}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
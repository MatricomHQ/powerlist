"use client"

import { usePathname, useRouter } from "next/navigation"
import { Home, Package, Plus, BarChart3, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { theme } from "@/lib/theme"

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Package, label: "Inventory", path: "/inventory" },
    { icon: Plus, label: "Add", path: "/camera", isSpecial: true },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
    { icon: User, label: "Profile", path: "/profile" },
  ]

  const handleNavigation = (path: string) => {
    // Ensure smooth client-side navigation for all routes
    router.push(path)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      {/* Background bar */}
      <nav className={`${theme.layout.nav.bottom}`}>
        <div className="flex items-center justify-around px-4 py-2 max-w-md mx-auto relative">
          {navItems.map((item, index) => {
            const isActive = pathname === item.path
            const Icon = item.icon

            if (item.isSpecial) {
              // Create space for the floating button
              return <div key={item.path} className="w-12" />
            }

            return (
              <Button
                key={item.path}
                variant="ghost"
                onClick={() => handleNavigation(item.path)}
                className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${theme.effects.transition} ${
                  isActive
                    ? `${theme.colors.status.success.text} bg-emerald-500/10 shadow-lg shadow-emerald-500/10`
                    : `${theme.colors.text.muted} hover:${theme.colors.text.secondary} hover:bg-slate-800/50`
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Button>
            )
          })}
        </div>
      </nav>

      {/* Floating Add Button - positioned to overlap above the bar with matching border */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50">
        <Button
          onClick={() => handleNavigation("/camera")}
          className={`h-16 w-16 rounded-full ${theme.colors.button.primary} ${theme.effects.shadow.large} border-4 ${theme.effects.transition} ${theme.effects.hover.scale} active:scale-95`}
          style={{
            borderColor: "rgb(30 41 59 / 0.8)", // Same as button bar background with backdrop-blur
            boxShadow: "0 0 0 4px rgb(30 41 59 / 0.8), 0 25px 50px -12px rgba(16, 185, 129, 0.5)",
          }}
        >
          <Plus className="h-8 w-8 text-white" />
        </Button>
      </div>
    </div>
  )
}

"use client"

import { Bell, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50 shadow-lg hidden md:block">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">PL</span>
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Power Lister
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="relative hover:bg-slate-800/50 text-slate-300 hover:text-white">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="relative hover:bg-slate-800/50 text-slate-300 hover:text-white">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 bg-red-500 text-white text-xs flex items-center justify-center border-0">
              3
            </Badge>
          </Button>
          <Button variant="ghost" size="sm" className="hover:bg-slate-800/50 text-slate-300 hover:text-white">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}

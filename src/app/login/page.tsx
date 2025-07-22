"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { theme } from "@/lib/theme"

export default function Login() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (method = "email") => {
    setIsLoading(true)
    // Set login flag immediately
    localStorage.setItem("powerListerLoggedIn", "true")

    // Simulate login delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Always redirect to main app regardless of input
    router.push("/")
  }

  const socialLogins = [
    {
      name: "Google",
      icon: "🔍",
      color: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
      shadow: "shadow-red-500/25",
    },
    {
      name: "Apple",
      icon: "🍎",
      color: "bg-gradient-to-r from-gray-800 to-black hover:from-black hover:to-gray-900",
      shadow: "shadow-gray-800/25",
    },
    {
      name: "Facebook",
      icon: "📘",
      color: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
      shadow: "shadow-blue-600/25",
    },
  ]

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${theme.colors.background.primary} flex items-center justify-center p-4`}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <Card className={`w-full max-w-md ${theme.layout.card} relative z-10`}>
        <CardContent className="p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              {/* Neon glow effect */}
              <div className="absolute inset-0 w-20 h-20 bg-emerald-500 rounded-full blur-xl opacity-60 animate-pulse" />
              <div
                className="absolute inset-0 w-20 h-20 bg-emerald-400 rounded-full blur-lg opacity-40 animate-pulse"
                style={{ animationDelay: "0.5s" }}
              />

              {/* Logo circle */}
              <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/50 border-2 border-emerald-300/30">
                <span className="text-3xl font-black text-white drop-shadow-lg">P</span>
              </div>
            </div>
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-8">
            <h1 className={`text-3xl font-bold ${theme.colors.text.gradient} mb-2`}>Welcome Back</h1>
            <p className={theme.colors.text.muted}>Sign in to continue to Power Lister</p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            {socialLogins.map((social) => (
              <Button
                key={social.name}
                onClick={() => handleLogin(social.name.toLowerCase())}
                disabled={isLoading}
                className={`w-full h-12 ${social.color} text-white border-0 shadow-xl ${social.shadow} ${theme.effects.transition} ${theme.effects.hover.scale} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span className="text-xl mr-3">{social.icon}</span>
                Continue with {social.name}
              </Button>
            ))}
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className={`absolute inset-0 flex items-center`}>
              <div className={`w-full border-t ${theme.colors.border.primary}`} />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-4 ${theme.colors.background.card} ${theme.colors.text.muted}`}>
                Or continue with email
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleLogin()
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="email" className={theme.colors.text.secondary}>
                Email Address
              </Label>
              <div className="relative mt-1">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${theme.colors.text.muted}`} />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`pl-10 h-12 ${theme.colors.background.input} ${theme.colors.border.primary} ${theme.colors.text.primary} placeholder:${theme.colors.text.disabled} ${theme.colors.border.focus}`}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className={theme.colors.text.secondary}>
                Password
              </Label>
              <div className="relative mt-1">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${theme.colors.text.muted}`} />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`pl-10 pr-10 h-12 ${theme.colors.background.input} ${theme.colors.border.primary} ${theme.colors.text.primary} placeholder:${theme.colors.text.disabled} ${theme.colors.border.focus}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${theme.colors.text.muted} hover:${theme.colors.text.secondary} ${theme.effects.transition}`}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-emerald-500 bg-slate-800 border-slate-600 rounded focus:ring-emerald-500 focus:ring-2"
                />
                <span className={`ml-2 ${theme.colors.text.secondary}`}>Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => handleLogin("forgot")}
                className={`${theme.colors.status.success.text} hover:text-emerald-300 ${theme.effects.transition}`}
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className={`w-full h-12 ${theme.colors.button.primary} text-lg font-semibold ${theme.effects.transition} ${theme.effects.hover.scale} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className={theme.colors.text.muted}>
              Don't have an account?{" "}
              <button
                onClick={() => handleLogin("signup")}
                className={`${theme.colors.status.success.text} hover:text-emerald-300 ${theme.effects.transition} font-medium`}
              >
                Sign up for free
              </button>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

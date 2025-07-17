"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Lock, Eye, EyeOff, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { apiClient, signInWithEmail } from "@/lib/api"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0)

  useEffect(() => {
    if (isBlocked && blockTimeRemaining > 0) {
      const timer = setInterval(() => {
        setBlockTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsBlocked(false)
            setLoginAttempts(0)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isBlocked, blockTimeRemaining])

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isBlocked) {
      setError(`Çok fazla başarısız deneme. ${Math.ceil(blockTimeRemaining / 60)} dakika sonra tekrar deneyin.`)
      return
    }
    setLoading(true)
    setError("")
    try {
      // await apiClient.login(email, password)
      await signInWithEmail(email, password)
      router.push("/admin")
    } catch (error: any) {
      const newAttempts = loginAttempts + 1
      setLoginAttempts(newAttempts)
      if (newAttempts >= 5) {
        setIsBlocked(true)
        setBlockTimeRemaining(15 * 60)
        setError("Çok fazla başarısız deneme. 15 dakika boyunca bloklandınız.")
      } else {
        setError(error.message || `Geçersiz kimlik bilgileri. Kalan deneme hakkı: ${5 - newAttempts}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[hsl(135,100%,97%)] to-[hsl(135,100%,95%)] dark:from-gray-900 dark:to-gray-950 relative">
      {/* Sağ üstte tema toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto"
      >
        <Card className="rounded-3xl shadow-xl border-0 bg-white/90 dark:bg-gray-900/90">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-[hsl(135,100%,50%)] to-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-md">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground mb-1 tracking-tight">Güvenli Admin Girişi</CardTitle>
            <p className="text-muted-foreground text-sm">Yönetici hesabınızla giriş yapın</p>
          </CardHeader>
          <CardContent className="space-y-6 pt-2 pb-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium">E-posta</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="username"
                  placeholder="admin@easytrade.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="mt-1 bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 focus:border-[hsl(135,100%,50%)] focus:ring-2 focus:ring-[hsl(135,100%,50%)] text-base rounded-xl px-4 py-3"
                  required
                  disabled={loading}
                />
              </div>
              <div className="relative">
                <Label htmlFor="password" className="text-sm font-medium">Şifre</Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Şifreniz"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="mt-1 bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 focus:border-[hsl(135,100%,50%)] focus:ring-2 focus:ring-[hsl(135,100%,50%)] text-base rounded-xl px-4 py-3 pr-10"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <Button
                type="submit"
                className="w-full mt-2 bg-[hsl(135,100%,50%)] hover:bg-[hsl(135,100%,45%)] text-black font-semibold rounded-xl py-3 text-base shadow-md transition-all duration-200"
                size="lg"
                disabled={loading}
              >
                {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

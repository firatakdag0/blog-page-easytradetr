"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, Eye, EyeOff, Smartphone, AlertTriangle, CheckCircle, Clock, Globe } from "lucide-react"
import { motion } from "framer-motion"

export default function AdminLogin() {
  const router = useRouter()
  const [step, setStep] = useState<"credentials" | "2fa">("credentials")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [twoFactorCode, setTwoFactorCode] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [ipAddress, setIpAddress] = useState("")
  const [sessionTimeout, setSessionTimeout] = useState(30 * 60) // 30 minutes
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0)

  // Get user's IP address
  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => setIpAddress(data.ip))
      .catch(() => setIpAddress("Bilinmiyor"))
  }, [])

  // Block timer
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

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Check credentials (in real app, this would be server-side)
    if (email === "admin@easytrade.com" && password === "Admin123!@#") {
      setStep("2fa")
    } else {
      const newAttempts = loginAttempts + 1
      setLoginAttempts(newAttempts)

      if (newAttempts >= 5) {
        setIsBlocked(true)
        setBlockTimeRemaining(15 * 60) // 15 minutes
        setError("Çok fazla başarısız deneme. 15 dakika boyunca bloklandınız.")
      } else {
        setError(`Geçersiz kimlik bilgileri. Kalan deneme hakkı: ${5 - newAttempts}`)
      }
    }

    setLoading(false)
  }

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simulate 2FA verification
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (twoFactorCode === "123456") {
      // Store auth token
      localStorage.setItem("admin_token", "authenticated")
      localStorage.setItem("admin_session_start", Date.now().toString())

      // Log successful login
      console.log("Admin login successful:", {
        email,
        ip: ipAddress,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      })

      router.push("/admin")
    } else {
      setError("Geçersiz 2FA kodu")
    }

    setLoading(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
          <CardHeader className="text-center pb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-white mb-2">Güvenli Admin Girişi</CardTitle>
            <p className="text-slate-300 text-sm">
              {step === "credentials" ? "Kimlik bilgilerinizi girin" : "2FA kodunuzu girin"}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Security Info */}
            <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">IP Adresi:</span>
                <span className="text-white font-mono">{ipAddress}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">Oturum Süresi:</span>
                <span className="text-white">{formatTime(sessionTimeout)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">Güvenlik:</span>
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  SSL Aktif
                </Badge>
              </div>
            </div>

            {error && (
              <Alert className="bg-red-500/20 border-red-500/30 text-red-300">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {step === "credentials" ? (
              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">
                    E-posta
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@easytrade.com"
                    className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
                    required
                    disabled={isBlocked}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-300">
                    Şifre
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Güçlü şifrenizi girin"
                      className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 pr-10"
                      required
                      disabled={isBlocked}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                      disabled={isBlocked}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {loginAttempts > 0 && !isBlocked && (
                  <div className="text-center">
                    <Badge variant="destructive" className="text-xs">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      {loginAttempts}/5 başarısız deneme
                    </Badge>
                  </div>
                )}

                {isBlocked && (
                  <div className="text-center">
                    <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                      <Clock className="w-3 h-3 mr-1" />
                      Bloklu: {formatTime(blockTimeRemaining)}
                    </Badge>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  disabled={loading || isBlocked}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Doğrulanıyor...
                    </div>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Giriş Yap
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handle2FASubmit} className="space-y-4">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Smartphone className="w-6 h-6 text-blue-400" />
                  </div>
                  <p className="text-slate-300 text-sm">Authenticator uygulamanızdan 6 haneli kodu girin</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twoFactorCode" className="text-slate-300">
                    2FA Kodu
                  </Label>
                  <Input
                    id="twoFactorCode"
                    type="text"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="123456"
                    className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 text-center text-2xl tracking-widest font-mono"
                    maxLength={6}
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("credentials")}
                    className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
                  >
                    Geri
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                    disabled={loading || twoFactorCode.length !== 6}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Doğrulanıyor...
                      </div>
                    ) : (
                      "Doğrula"
                    )}
                  </Button>
                </div>
              </form>
            )}

            {/* Security Features */}
            <div className="border-t border-slate-700 pt-6">
              <h4 className="text-slate-300 text-sm font-medium mb-3">Güvenlik Özellikleri</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center text-slate-400">
                  <CheckCircle className="w-3 h-3 mr-2 text-green-400" />
                  2FA Koruması
                </div>
                <div className="flex items-center text-slate-400">
                  <CheckCircle className="w-3 h-3 mr-2 text-green-400" />
                  IP Kısıtlaması
                </div>
                <div className="flex items-center text-slate-400">
                  <CheckCircle className="w-3 h-3 mr-2 text-green-400" />
                  Oturum Zaman Aşımı
                </div>
                <div className="flex items-center text-slate-400">
                  <CheckCircle className="w-3 h-3 mr-2 text-green-400" />
                  Aktivite Logu
                </div>
              </div>
            </div>

            {/* Demo Credentials */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
              <p className="text-amber-300 text-xs font-medium mb-2">Demo Bilgileri:</p>
              <div className="text-xs text-amber-200 space-y-1">
                <div>E-posta: admin@easytrade.com</div>
                <div>Şifre: Admin123!@#</div>
                <div>2FA Kodu: 123456</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-slate-400 text-xs">
          <div className="flex items-center justify-center mb-2">
            <Globe className="w-4 h-4 mr-2" />
            Güvenli bağlantı ile korunuyor
          </div>
          <p>© 2024 EasyTrade Blog Admin Panel</p>
        </div>
      </motion.div>
    </div>
  )
}

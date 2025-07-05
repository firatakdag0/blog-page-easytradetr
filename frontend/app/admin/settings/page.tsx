"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Settings,
  Shield,
  Globe,
  Bell,
  Database,
  Mail,
  Key,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [settings, setSettings] = useState({
    // General Settings
    siteName: "EasyTrade Blog",
    siteDescription: "İşletmeniz için teknoloji çözümleri ve dijital dönüşüm rehberi",
    siteUrl: "https://blog.easytrade.com",
    adminEmail: "admin@easytrade.com",
    timezone: "Europe/Istanbul",
    language: "tr",
    
    // Security Settings
    twoFactorEnabled: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    ipWhitelist: "192.168.1.0/24, 10.0.0.0/8",
    passwordMinLength: 12,
    requireSpecialChars: true,
    
    // Content Settings
    autoApproveComments: false,
    moderateFirstComment: true,
    enableSpamFilter: true,
    maxCommentLength: 1000,
    allowGuestComments: true,
    
    // Email Settings
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUsername: "noreply@easytrade.com",
    smtpPassword: "••••••••••••",
    emailFromName: "EasyTrade Blog",
    
    // Notification Settings
    emailNotifications: true,
    newCommentNotification: true,
    newUserNotification: false,
    systemAlerts: true,
    weeklyReports: true,
    
    // Backup Settings
    autoBackup: true,
    backupFrequency: "daily",
    backupRetention: 30,
    backupLocation: "cloud",
    
    // API Settings
    apiEnabled: true,
    apiKey: "sk_live_51234567890abcdef",
    rateLimitPerHour: 1000,
    allowCors: true
  })

  const handleSave = async (section: string) => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log(`Saving ${section} settings:`, settings)
    setLoading(false)
  }

  const handleBackup = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log("Creating backup...")
    setLoading(false)
  }

  const handleRestore = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log("Restoring from backup...")
    setLoading(false)
  }

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sistem Ayarları</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Blog ve admin paneli ayarlarını yönetin ve güvenlik önlemlerini yapılandırın.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Sistem Sağlıklı
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Genel
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Güvenlik
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            İçerik
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Bildirimler
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Yedekleme
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Key className="w-4 h-4" />
            API
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Genel Ayarlar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Adı</Label>
                    <Input
                      id="siteName"
                      value={settings.siteName}
                      onChange={(e) => updateSetting("siteName", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="siteUrl">Site URL</Label>
                    <Input
                      id="siteUrl"
                      value={settings.siteUrl}
                      onChange={(e) => updateSetting("siteUrl", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Açıklaması</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) => updateSetting("siteDescription", e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Admin E-posta</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      value={settings.adminEmail}
                      onChange={(e) => updateSetting("adminEmail", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Zaman Dilimi</Label>
                    <Select value={settings.timezone} onValueChange={(value) => updateSetting("timezone", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Europe/Istanbul">Türkiye (UTC+3)</SelectItem>
                        <SelectItem value="UTC">UTC (UTC+0)</SelectItem>
                        <SelectItem value="America/New_York">New York (UTC-5)</SelectItem>
                        <SelectItem value="Europe/London">Londra (UTC+0)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => handleSave("general")} disabled={loading}>
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Kaydediliyor...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Kaydet
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Güvenlik Ayarları
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Güvenlik ayarlarını değiştirirken dikkatli olun. Yanlış yapılandırma sisteme erişimi engelleyebilir.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="twoFactor">İki Faktörlü Doğrulama (2FA)</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Giriş güvenliğini artırmak için 2FA'yı etkinleştirin
                      </p>
                    </div>
                    <Switch
                      id="twoFactor"
                      checked={settings.twoFactorEnabled}
                      onCheckedChange={(checked) => updateSetting("twoFactorEnabled", checked)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Oturum Zaman Aşımı (dakika)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        value={settings.sessionTimeout}
                        onChange={(e) => updateSetting("sessionTimeout", Number.parseInt(e.target.value))}
                        min="5"
                        max="480"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="maxLoginAttempts">Maksimum Giriş Denemesi</Label>
                      <Input
                        id="maxLoginAttempts"
                        type="number"
                        value={settings.maxLoginAttempts}
                        onChange={(e) => updateSetting("maxLoginAttempts", Number.parseInt(e.target.value))}
                        min="3"
                        max="10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ipWhitelist">IP Beyaz Listesi</Label>
                    <Textarea
                      id="ipWhitelist"
                      value={settings.ipWhitelist}
                      onChange={(e) => updateSetting("ipWhitelist", e.target.value)}
                      placeholder="192.168.1.0/24, 10.0.0.0/8"
                      rows={2}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Admin paneline erişim izni verilen IP adresleri (CIDR formatında)
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="passwordMinLength">Minimum Şifre Uzunluğu</Label>
                      <Input
                        id="passwordMinLength"
                        type="number"
                        value={settings.passwordMinLength}
                        onChange={(e) => updateSetting("passwordMinLength", Number.parseInt(e.target.value))}
                        min="8"
                        max="32"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Özel Karakter Zorunluluğu</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Şifrelerde özel karakter kullanımını zorunlu kıl
                        </p>
                      </div>
                      <Switch
                        checked={settings.requireSpecialChars}
                        onCheckedChange={(checked) => updateSetting("requireSpecialChars", checked)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => handleSave("security")} disabled={loading}>
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Kaydediliyor...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Kaydet
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Content Settings */}
        <TabsContent value="content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  İçerik Ayarları
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Yorumları Otomatik Onayla</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Yeni yorumlar otomatik olarak onaylanır
                      </p>
                    </div>
                    <Switch
                      checked={settings.autoApproveComments}
                      onCheckedChange={(checked) => updateSetting("autoApproveComments", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>İlk Yorumu Modere Et</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Kullanıcıların ilk yorumu manuel onay gerektirir
                      </p>
                    </div>
                    <Switch
                      checked={settings.moderateFirstComment}
                      onCheckedChange={(checked) => updateSetting("moderateFirstComment", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Spam Filtresi</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Otomatik spam tespiti ve engelleme
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableSpamFilter}
                      onCheckedChange={(checked) => updateSetting("enableSpamFilter", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Misafir Yorumlarına İzin Ver</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Kayıt olmayan kullanıcılar yorum yapabilir
                      </p>
                    </div>
                    <Switch
                      checked={settings.allowGuestComments}
                      onCheckedChange={(checked) => updateSetting("allowGuestComments", checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxCommentLength">Maksimum Yorum Uzunluğu</Label>
                    <Input
                      id="maxCommentLength"
                      type="number"
                      value={settings.maxCommentLength}
                      onChange={(e) => updateSetting("maxCommentLength", Number.parseInt(e.target.value))}
                      min="100"
                      max="5000"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Yorumların maksimum karakter sayısı
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => handleSave("content")} disabled={loading}>
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Kaydediliyor...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Kaydet
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  E-posta Ayarları
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="smtpHost">SMTP Sunucu</Label>
                    <Input
                      id="smtpHost"
                      value={settings.smtpHost}
                      onChange={(e) => updateSetting("smtpHost", e.target.value)}\

"use client"

import { useState } from "react"
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
    siteName: "EasyTrade Blog",
    siteDescription: "İşletmeniz için teknoloji çözümleri ve dijital dönüşüm rehberi",
    siteUrl: "https://blog.easytrade.com",
    adminEmail: "admin@easytrade.com",
    timezone: "Europe/Istanbul",
    twoFactorEnabled: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    autoApproveComments: false,
    moderateFirstComment: true,
    enableSpamFilter: true,
    emailNotifications: true,
    newCommentNotification: true,
    weeklyReports: true,
    autoBackup: true,
    backupFrequency: "daily",
    backupRetention: 30,
    apiEnabled: true,
    apiKey: "sk_live_51234567890abcdef",
    rateLimitPerHour: 1000,
    allowCors: true
  })

  const handleSave = async (section: string) => {
    setLoading(true)
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
        <TabsList className="grid w-full grid-cols-4">
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
          <TabsTrigger value="backup" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Yedekleme
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
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
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Settings */}
        <TabsContent value="content">
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
                    <Label htmlFor="autoApproveComments">Yorumları Otomatik Onayla</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Yeni yorumları otomatik olarak yayınla
                    </p>
                  </div>
                  <Switch
                    id="autoApproveComments"
                    checked={settings.autoApproveComments}
                    onCheckedChange={(checked) => updateSetting("autoApproveComments", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="moderateFirstComment">İlk Yorumu Modere Et</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Yeni kullanıcıların ilk yorumunu onay gerektir
                    </p>
                  </div>
                  <Switch
                    id="moderateFirstComment"
                    checked={settings.moderateFirstComment}
                    onCheckedChange={(checked) => updateSetting("moderateFirstComment", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableSpamFilter">Spam Filtresi</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Spam yorumları otomatik olarak filtrele
                    </p>
                  </div>
                  <Switch
                    id="enableSpamFilter"
                    checked={settings.enableSpamFilter}
                    onCheckedChange={(checked) => updateSetting("enableSpamFilter", checked)}
                  />
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup Settings */}
        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Yedekleme Ayarları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoBackup">Otomatik Yedekleme</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Düzenli olarak otomatik yedekleme yap
                    </p>
                  </div>
                  <Switch
                    id="autoBackup"
                    checked={settings.autoBackup}
                    onCheckedChange={(checked) => updateSetting("autoBackup", checked)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="backupFrequency">Yedekleme Sıklığı</Label>
                    <Select value={settings.backupFrequency} onValueChange={(value) => updateSetting("backupFrequency", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Günlük</SelectItem>
                        <SelectItem value="weekly">Haftalık</SelectItem>
                        <SelectItem value="monthly">Aylık</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="backupRetention">Yedek Saklama Süresi (gün)</Label>
                    <Input
                      id="backupRetention"
                      type="number"
                      value={settings.backupRetention}
                      onChange={(e) => updateSetting("backupRetention", Number.parseInt(e.target.value))}
                      min="1"
                      max="365"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleBackup} disabled={loading}>
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Yedekleniyor...
                      </>
                    ) : (
                      <>
                        <Database className="w-4 h-4 mr-2" />
                        Manuel Yedekleme
                      </>
                    )}
                  </Button>
                  
                  <Button variant="outline" onClick={handleRestore} disabled={loading}>
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Geri Yükleniyor...
                      </>
                    ) : (
                      <>
                        <Database className="w-4 h-4 mr-2" />
                        Geri Yükle
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
"use client"
import Link from "next/link"
import { AnimatedLogo } from "./animated-logo"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted/30 border-t mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo ve Açıklama */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <AnimatedLogo size={40} />
              <div>
                <h3 className="text-lg font-bold text-foreground">Easytrade</h3>
                <p className="text-sm text-muted-foreground">Bulut Tabanlı Satış Sistemi</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              İşletmenizi dijital çağa taşıyan, kullanıcı dostu ve güvenilir ön muhasebe, barkod ve satış yönetimi
              çözümleri sunuyoruz.
            </p>
            <div className="flex items-center gap-3">
              <Link href="#" className="text-muted-foreground hover:text-[hsl(135,100%,50%)] transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-[hsl(135,100%,50%)] transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-[hsl(135,100%,50%)] transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-[hsl(135,100%,50%)] transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Ürünler */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Ürünler</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Barkod Sistemi
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Ön Muhasebe
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Satış Noktası (POS)
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Stok Yönetimi
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Raporlama
                </Link>
              </li>
            </ul>
          </div>

          {/* Şirket */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Şirket</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Başarı Hikayeleri
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Kariyer
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* İletişim */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">İletişim</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-[hsl(135,100%,50%)]" />
                info@easytrade.com.tr
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-[hsl(135,100%,50%)]" />
                +90 (212) 123 45 67
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-[hsl(135,100%,50%)] mt-0.5" />
                <span>
                  İstanbul, Türkiye
                  <br />
                  Teknoloji Merkezi
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Alt Kısım */}
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">© {currentYear} Easytrade. Tüm hakları saklıdır.</div>
          <div className="flex items-center gap-6 text-sm">
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Gizlilik Politikası
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Kullanım Şartları
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Çerez Politikası
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

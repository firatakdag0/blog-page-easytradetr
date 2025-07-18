"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { motion, AnimatePresence } from "framer-motion"
import type { Category } from "@/lib/api"

interface ModernHeaderProps {
  categories: Category[] // full list from API
  selectedCategory: string
  onCategoryChange: (category: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

// Hardcoded 8 categories (now 7, 'Satış Noktası (POS)' removed)
const FIXED_CATEGORIES = [
  { id: 1, name: "Ön Muhasebe", slug: "on-muhasebe" },
  { id: 2, name: "Barkod Sistemi", slug: "barkod-sistemi" },
  { id: 4, name: "Bulut Teknolojisi", slug: "bulut-teknolojisi" },
  { id: 5, name: "Perakende Yönetimi", slug: "perakende-yonetimi" },
  { id: 6, name: "Stok Yönetimi", slug: "stok-yonetimi" },
  { id: 7, name: "Müşteri İlişkileri", slug: "musteri-iliskileri" },
  { id: 8, name: "Dijital Dönüşüm", slug: "dijital-donusum" },
];

export function ModernHeader({
  categories,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: ModernHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Only use the fixed categories for header
  const horizontalCategories = FIXED_CATEGORIES;
  // Hamburger menu: categories not in fixed list
  const otherCategories = categories.filter(
    (cat) => !FIXED_CATEGORIES.some((fixed) => fixed.slug === cat.slug)
  );

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center gap-3">
              <img src="/easytrade-logo.png" alt="Easytrade Logo" width={32} height={32} className="w-8 h-8" />
              <div>
                <h1 className="text-lg font-semibold text-foreground">Easytrade Blog</h1>
              </div>
            </div>

            {/* Desktop Categories - Only fixed categories, with 'Tümü' at the start */}
            <nav className="hidden xl:flex items-center gap-4">
              <Button
                key="tum"
                onClick={() => onCategoryChange("")}
                variant={selectedCategory === "" ? "default" : "ghost"}
                size="sm"
                className="h-8 px-3 rounded-full flex items-center gap-2 transition-all duration-200 hover:scale-105"
              >
                Tümü
              </Button>
              {horizontalCategories.map((category) => (
                <Button
                  key={category.id}
                  onClick={() => onCategoryChange(category.slug)}
                  variant={selectedCategory === category.slug ? "default" : "ghost"}
                  size="sm"
                  className="h-8 px-3 rounded-full flex items-center gap-2 transition-all duration-200 hover:scale-105"
                >
                  {category.name}
                </Button>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Desktop Search */}
              <div className="hidden lg:flex items-center">
                {isSearchOpen ? (
                  <motion.div 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Input
                      type="text"
                      placeholder="Ara..."
                      value={searchQuery}
                      onChange={(e) => onSearchChange(e.target.value)}
                      className="w-64 h-8"
                      autoFocus
                    />
                    <Button variant="ghost" size="sm" onClick={() => setIsSearchOpen(false)} className="h-8 w-8 p-0">
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => setIsSearchOpen(true)} className="h-8 w-8 p-0">
                    <Search className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <ThemeToggle />

              {/* Mobile Menu Button - Hamburger her zaman göster */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(true)}
                className="flex xl:hidden h-8 w-8 p-0 relative group"
              >
                {/* 3-line hamburger icon */}
                <div className="flex flex-col gap-1">
                  <div className="w-4 h-0.5 bg-current rounded-full transition-all duration-200 group-hover:bg-blue-500"></div>
                  <div className="w-4 h-0.5 bg-current rounded-full transition-all duration-200 group-hover:bg-purple-500"></div>
                  <div className="w-4 h-0.5 bg-current rounded-full transition-all duration-200 group-hover:bg-pink-500"></div>
                </div>
                {/* Animated background on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Side Panel for Categories */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            
            {/* Side Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-background border-l shadow-2xl z-50 overflow-hidden"
            >
              {/* Panel Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Kategoriler</h2>
                    <p className="text-sm text-muted-foreground">{FIXED_CATEGORIES.length} kategori mevcut</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMenuOpen(false)}
                  className="h-8 w-8 p-0 hover:bg-red-500/10 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Panel Content */}
              <div className="flex flex-col h-full">
                {/* Search Section */}
                <div className="p-6 border-b">
                  <div className="relative group">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 group-focus-within:text-blue-500 transition-colors duration-200" />
                    <Input
                      type="text"
                      placeholder="Kategorilerde ara..."
                      value={searchQuery}
                      onChange={(e) => onSearchChange(e.target.value)}
                      className="pl-10 w-full h-11 border-2 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Categories List in Hamburger - show remaining categories */}
                <div className="flex-1 overflow-y-auto p-6 space-y-2">
                  <Button
                    key="tum"
                    onClick={() => {
                      onCategoryChange("");
                      setIsMenuOpen(false);
                    }}
                    variant={selectedCategory === "" ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start h-12 text-left group transition-all duration-200"
                  >
                    Tümü
                  </Button>
                  {FIXED_CATEGORIES.map((category) => (
                    <Button
                      key={category.id}
                      onClick={() => {
                        onCategoryChange(category.slug);
                        setIsMenuOpen(false);
                      }}
                      variant={selectedCategory === category.slug ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start h-12 text-left group transition-all duration-200"
                    >
                      {category.name}
                    </Button>
                  ))}
                  {otherCategories.length > 0 && (
                    <div className="pt-4 border-t mt-4">
                      {otherCategories.map((category) => (
                        <Button
                          key={category.id}
                          onClick={() => {
                            onCategoryChange(category.slug);
                            setIsMenuOpen(false);
                          }}
                          variant={selectedCategory === category.slug ? "default" : "ghost"}
                          size="sm"
                          className="w-full justify-start h-12 text-left group transition-all duration-200"
                        >
                          {category.name}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Panel Footer */}
                <div className="p-6 border-t bg-muted/30">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="space-y-1">
                      <div className="text-xl font-bold text-blue-600">{FIXED_CATEGORIES.length}</div>
                      <div className="text-xs text-muted-foreground">Kategori</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xl font-bold text-green-600">∞</div>
                      <div className="text-xs text-muted-foreground">İçerik</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xl font-bold text-purple-600">24/7</div>
                      <div className="text-xs text-muted-foreground">Güncel</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

"use client"

import { useState } from "react"
import { Search, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import type { Category } from "@/lib/api"

interface ModernHeaderProps {
  categories: Category[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function ModernHeader({
  categories,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: ModernHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
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

          {/* Desktop Categories - Hidden on any responsive breakpoint */}
          <nav className="hidden xl:flex items-center gap-1">
          
            {categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => onCategoryChange(category.slug)}
                variant={selectedCategory === category.slug ? "default" : "ghost"}
                size="sm"
                className="h-8 px-3 rounded-full"
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
                <div className="flex items-center gap-2">
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
                </div>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => setIsSearchOpen(true)} className="h-8 w-8 p-0">
                  <Search className="h-4 w-4" />
                </Button>
              )}
            </div>

            <ThemeToggle />

            {/* Mobile Menu Button - Shows on xl and below */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="xl:hidden h-8 w-8 p-0"
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Shows when categories are hidden */}
      {isMenuOpen && (
        <div className="xl:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <div className="lg:hidden relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Ara..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 w-full"
              />
            </div>

            {/* Mobile Categories */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Kategoriler</h3>
              <div className="space-y-1">
                <Button
                  onClick={() => {
                    onCategoryChange("")
                    setIsMenuOpen(false)
                  }}
                  variant={selectedCategory === "" ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start h-9"
                >
                  Tümü
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    onClick={() => {
                      onCategoryChange(category.slug)
                      setIsMenuOpen(false)
                    }}
                    variant={selectedCategory === category.slug ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start h-9"
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

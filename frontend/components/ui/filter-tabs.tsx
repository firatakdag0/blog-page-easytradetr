"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Bookmark, TrendingUp, Clock, Star } from "lucide-react"

interface FilterTabsProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
  counts: {
    all: number
    saved: number
    trending: number
    recent: number
    featured: number
  }
}

export function FilterTabs({ activeFilter, onFilterChange, counts }: FilterTabsProps) {
  const filters = [
    { id: "all", name: "Tümü", icon: BookOpen, count: counts.all },
    { id: "saved", name: "Kaydedilenler", icon: Bookmark, count: counts.saved },
    { id: "trending", name: "Trend", icon: TrendingUp, count: counts.trending },
    { id: "recent", name: "Yeni", icon: Clock, count: counts.recent },
    { id: "featured", name: "Öne Çıkan", icon: Star, count: counts.featured },
  ]

  return (
    <div className="flex flex-wrap gap-2 justify-center mb-8">
      {filters.map((filter) => {
        const Icon = filter.icon
        const isActive = activeFilter === filter.id
        return (
          <Button
            key={filter.id}
            variant={isActive ? "default" : "outline"}
            onClick={() => onFilterChange(filter.id)}
            className={`transition-all duration-300 rounded-xl ${
              isActive
                ? "bg-[hsl(135,100%,50%)] hover:bg-[hsl(135,100%,45%)] text-black shadow-lg scale-105"
                : "hover:bg-muted hover:scale-105"
            }`}
            size="sm"
          >
            <Icon className="h-4 w-4 mr-2" />
            {filter.name}
            <Badge variant="secondary" className="ml-2 text-xs rounded-full">
              {filter.count}
            </Badge>
          </Button>
        )
      })}
    </div>
  )
}

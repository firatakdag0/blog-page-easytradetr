import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import React from "react"

interface RefreshButtonProps {
  onClick: () => void
  loading?: boolean
  className?: string
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({ onClick, loading, className }) => (
  <Button variant="outline" onClick={onClick} disabled={loading} className={className}>
    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
    Yenile
  </Button>
) 
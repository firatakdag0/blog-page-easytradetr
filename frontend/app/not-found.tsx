"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, ArrowLeft, Search, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* 404 Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <div className="relative inline-block">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full flex items-center justify-center border-4 border-red-500/30">
                <AlertTriangle className="w-16 h-16 text-red-500" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                4
              </div>
              <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                4
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <Card className="bg-gradient-to-br from-background to-muted/30 border-0 shadow-2xl">
            <CardContent className="p-8 md:p-12">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-6xl font-bold text-foreground mb-4"
              >
                404
              </motion.h1>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl md:text-3xl font-semibold text-foreground mb-4"
              >
                Sayfa Bulunamadı
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed"
              >
                Aradığınız sayfa mevcut değil veya taşınmış olabilir. 
                Ana sayfaya dönerek doğru içeriği bulabilirsiniz.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Link href="/">
                  <Button 
                    size="lg"
                    className="bg-[hsl(135,100%,50%)] hover:bg-[hsl(135,100%,45%)] text-black px-8 py-3 rounded-2xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <Home className="w-5 h-5 mr-2" />
                    Ana Sayfaya Git
                  </Button>
                </Link>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => window.history.back()}
                  className="px-8 py-3 rounded-2xl font-semibold transition-all duration-200 hover:scale-105 border-2"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Geri Dön
                </Button>
              </motion.div>

              {/* Search Suggestion */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-8 p-4 bg-muted/50 rounded-2xl"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Search className="w-5 h-5 text-muted-foreground" />
                  <h3 className="font-semibold text-foreground">Aradığınızı bulamadınız mı?</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Blog sayfamızda arama yaparak istediğiniz içeriği bulabilirsiniz.
                </p>
                <Link href="/blog">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="mt-3 text-[hsl(135,100%,50%)] hover:text-[hsl(135,100%,45%)] hover:bg-[hsl(135,100%,50%)]/10"
                  >
                    Blog'a Git →
                  </Button>
                </Link>
              </motion.div>
            </CardContent>
          </Card>

          {/* Floating Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute inset-0 pointer-events-none overflow-hidden"
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-[hsl(135,100%,50%)] rounded-full opacity-20"
                style={{
                  left: `${10 + i * 15}%`,
                  top: `${20 + i * 10}%`,
                }}
                animate={{
                  y: [-10, 10, -10],
                  opacity: [0.2, 0.5, 0.2],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.5,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
} 
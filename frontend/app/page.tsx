import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[hsl(135,100%,50%)] to-blue-600 bg-clip-text text-transparent">
            EasyTrade Blog
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
            İşletmenizi geleceğe taşıyacak dijital içerikler ve stratejiler
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Dijital pazarlama, e-ticaret, teknoloji ve iş dünyasından en güncel 
            içerikleri keşfedin. Uzman yazarlarımızın kaleminden pratik bilgiler 
            ve başarı hikayeleri.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-[hsl(135,100%,50%)] text-black hover:bg-[hsl(135,100%,40%)] px-8 py-4 text-lg"
              asChild
            >
              <Link href="/blog">
                <BookOpen className="h-5 w-5 mr-2" />
                Blog'a Git
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-[hsl(135,100%,50%)] text-[hsl(135,100%,50%)] hover:bg-[hsl(135,100%,50%)] hover:text-black px-8 py-4 text-lg"
              asChild
            >
              <Link href="/admin">
                Admin Paneli
              </Link>
            </Button>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <div className="text-3xl font-bold text-[hsl(135,100%,50%)] mb-2">100+</div>
              <div className="text-gray-600 dark:text-gray-300">Makale</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <div className="text-3xl font-bold text-[hsl(135,100%,50%)] mb-2">50+</div>
              <div className="text-gray-600 dark:text-gray-300">Kategori</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <div className="text-3xl font-bold text-[hsl(135,100%,50%)] mb-2">10+</div>
              <div className="text-gray-600 dark:text-gray-300">Yazar</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

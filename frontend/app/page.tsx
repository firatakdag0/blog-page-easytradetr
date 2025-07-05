import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Play, Settings } from "lucide-react"

export default function Home() {
  return (
    <section className="w-full pt-20">
      <div className="container grid items-center justify-center gap-6 pt-20 md:pt-10">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <h1 className="space-y-2 font-bold text-5xl md:text-7xl">
            The ultimate <span className="text-[hsl(135,100%,50%)]">AI tool</span> <br />
            for your <span className="underline decoration-[hsl(135,100%,50%)]">success</span>
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground">
            Unleash the power of AI with our cutting-edge platform. Experience the future of innovation and efficiency.
          </p>
          <div className="space-x-4">
            <Button size="lg" className="bg-[hsl(135,100%,50%)] text-black hover:bg-[hsl(135,100%,40%)]">
              Try it now
              <Play className="h-5 w-5 ml-2" />
            </Button>
            {/* Add this button alongside existing buttons in the hero section */}
            <Button
              size="lg"
              variant="outline"
              className="border-[hsl(135,100%,50%)] text-[hsl(135,100%,50%)] hover:bg-[hsl(135,100%,50%)] hover:text-black bg-transparent"
              asChild
            >
              <Link href="/admin">
                <Settings className="h-5 w-5 mr-2" />
                Admin Panel
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

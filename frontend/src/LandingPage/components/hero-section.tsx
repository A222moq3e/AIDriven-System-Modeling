import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronDown } from "lucide-react"
import { ProductMockup } from "@/components/product-mockup"

const trustLogos = ["University of Tech", "DevCorp", "StartupX", "CodeAcademy", "DataFlow Inc"]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="flex flex-col items-start">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Generate ERDs, UML, and flow diagrams from text in seconds.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Transform plain-text descriptions into professional system diagrams instantly. Built for speed, clarity,
              and consistency—perfect for students, developers, and analysts.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" className="gap-2">
                Try the Demo
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                View Examples
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-12 border-t border-border pt-8">
              <p className="text-sm text-muted-foreground mb-4">Used by students, teams, and instructors</p>
              <div className="flex flex-wrap items-center gap-6">
                {trustLogos.map((logo) => (
                  <span key={logo} className="text-sm font-medium text-muted-foreground/70">
                    {logo}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="relative">
            <ProductMockup />
          </div>
        </div>
      </div>
    </section>
  )
}

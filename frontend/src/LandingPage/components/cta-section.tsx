import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CtaSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <div className="rounded-2xl bg-card border border-border p-8 sm:p-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Turn text into diagrams—fast.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Stop spending hours drawing diagrams manually. Describe your system and let AI do the rest.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" className="gap-2">
              Try the Demo
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              View Documentation
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

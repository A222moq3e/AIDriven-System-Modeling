import { Card, CardContent } from "@/components/ui/card"
import { PenLine, ListFilter, Sparkles } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: PenLine,
    title: "Write your prompt",
    description: "Describe your entities, relationships, or interactions in plain text.",
    example: `"Create an ERD for a hospital system with patients, doctors, appointments, and medical records. Patients can have multiple appointments with different doctors."`,
  },
  {
    number: "02",
    icon: ListFilter,
    title: "Select diagram type",
    description: "Choose from ERD, UML class diagram, sequence diagram, or flowchart.",
    example: null,
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Generate & export",
    description: "Get your diagram instantly. Export as PNG or SVG for your documentation.",
    example: null,
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">How it works</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to go from text to diagram
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-border -translate-x-1/2 z-0" />
              )}
              <Card className="bg-card border-border relative z-10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground font-mono font-bold text-sm">
                      {step.number}
                    </div>
                    <step.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
                  {step.example && (
                    <div className="rounded-md bg-muted/50 border border-border p-3">
                      <code className="text-xs text-muted-foreground font-mono">{step.example}</code>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

import { Card, CardContent } from "@/components/ui/card"
import { Zap, Layers, Download, Grid3X3, Link2, History } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Text → Diagram instantly",
    description: "Describe your system in plain text and get a professional diagram in seconds.",
  },
  {
    icon: Layers,
    title: "Multiple diagram types",
    description: "Support for ERD, UML class diagrams, sequence diagrams, and flowcharts.",
  },
  {
    icon: Download,
    title: "Export PNG/SVG",
    description: "Download your diagrams in high-quality PNG or scalable SVG format.",
  },
  {
    icon: Grid3X3,
    title: "Consistent notation & layout",
    description: "Auto-arranged layouts following standard notation conventions.",
  },
  {
    icon: Link2,
    title: "Shareable links",
    description: "Generate shareable links to collaborate with your team or class.",
  },
  {
    icon: History,
    title: "History & versioning",
    description: "Access previous versions and track changes to your diagrams.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="px-4 py-20 sm:px-6 lg:px-8 bg-muted/20">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Key Benefits</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to create professional system diagrams
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="bg-card border-border hover:border-accent/50 transition-colors">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <feature.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

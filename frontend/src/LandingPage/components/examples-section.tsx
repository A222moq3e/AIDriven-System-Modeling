import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const examples = [
  {
    title: "Entity Relationship Diagram",
    description: "Hospital management database schema with patients, doctors, and appointments",
    image: "/images/er-diagram.png",
    badge: "ERD",
  },
  {
    title: "UML Class Diagram",
    description: "Object-oriented hospital system with classes, attributes, and relationships",
    image: "/images/class-diagram-20.png",
    badge: "Class",
  },
  {
    title: "Sequence Diagram",
    description: "Patient visit flow from arrival through treatment to discharge",
    image: "/images/sequence-diagram-20.png",
    badge: "Sequence",
  },
  {
    title: "Flowchart",
    description: "Decision flow for patient triage and department routing",
    image: "/images/prompt.png",
    badge: "Flowchart",
  },
]

export function ExamplesSection() {
  return (
    <section id="examples" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Examples</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            See what you can create with just a few sentences of text
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {examples.map((example) => (
            <Card
              key={example.title}
              className="bg-card border-border overflow-hidden group hover:border-accent/50 transition-colors"
            >
              <div className="aspect-video bg-muted/30 overflow-hidden">
                <img
                  src={example.image || "/placeholder.svg"}
                  alt={example.title}
                  className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-accent border-accent/50">
                    {example.badge}
                  </Badge>
                </div>
                <h3 className="font-semibold text-foreground">{example.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{example.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

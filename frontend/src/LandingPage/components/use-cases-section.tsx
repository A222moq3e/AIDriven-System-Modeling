"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, Code2, BarChart3, BookOpen } from "lucide-react"

const useCases = [
  {
    id: "students",
    icon: GraduationCap,
    title: "Students",
    description: "Perfect for database design assignments, software engineering projects, and thesis documentation.",
    examples: ["Database design coursework", "Software architecture diagrams", "Thesis and project documentation"],
  },
  {
    id: "engineers",
    icon: Code2,
    title: "Backend Engineers",
    description: "Quickly visualize database schemas and system interactions during planning phases.",
    examples: ["Schema planning", "API flow documentation", "System integration diagrams"],
  },
  {
    id: "analysts",
    icon: BarChart3,
    title: "Product & Analysts",
    description: "Map out user journeys, system flows, and business processes for stakeholder communication.",
    examples: ["User journey mapping", "Process documentation", "Stakeholder presentations"],
  },
  {
    id: "instructors",
    icon: BookOpen,
    title: "Instructors",
    description: "Create clear teaching examples and visual aids for database and software engineering courses.",
    examples: ["Lecture materials", "Assignment examples", "Interactive demonstrations"],
  },
]

export function UseCasesSection() {
  const [activeTab, setActiveTab] = useState("students")

  const activeCase = useCases.find((uc) => uc.id === activeTab)

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 bg-muted/20">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Built for everyone</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            From students to professionals, we've got your diagramming needs covered
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {useCases.map((useCase) => (
            <button
              key={useCase.id}
              onClick={() => setActiveTab(useCase.id)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === useCase.id
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <useCase.icon className="h-4 w-4" />
              {useCase.title}
            </button>
          ))}
        </div>

        {activeCase && (
          <Card className="bg-card border-border max-w-2xl mx-auto">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <activeCase.icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{activeCase.title}</h3>
              </div>
              <p className="text-muted-foreground mb-4">{activeCase.description}</p>
              <ul className="space-y-2">
                {activeCase.examples.map((example) => (
                  <li key={example} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {example}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  )
}

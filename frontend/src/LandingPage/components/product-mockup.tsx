"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Share2 } from "lucide-react"

const diagramTypes = ["ERD", "Class Diagram", "Sequence Diagram", "Flowchart"]

export function ProductMockup() {
  const [selectedType, setSelectedType] = useState("Sequence Diagram")

  return (
    <Card className="bg-card border-border overflow-hidden">
      <CardHeader className="border-b border-border bg-muted/30 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <div className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>
          <Badge variant="secondary" className="text-xs">
            Preview
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div>
          <label className="text-xs text-muted-foreground mb-2 block">Your prompt</label>
          <div className="rounded-md bg-muted/50 border border-border p-3">
            <p className="text-sm text-foreground font-mono">
              I need a sequence diagram for the process of a patient visiting a hospital...
            </p>
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-2 block">Diagram type</label>
          <div className="flex flex-wrap gap-2">
            {diagramTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedType === type
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-2 block">Generated diagram</label>
          <div className="aspect-video rounded-md bg-muted/30 border border-border flex items-center justify-center overflow-hidden">
            <img
              src="/images/sequence-diagram-20.png"
              alt="Sequence diagram showing hospital patient visit flow"
              className="w-full h-full object-contain p-2"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" className="flex-1 gap-2">
            <Download className="h-4 w-4" />
            Export PNG
          </Button>
          <Button size="sm" variant="outline" className="flex-1 gap-2 bg-transparent">
            <Share2 className="h-4 w-4" />
            Export SVG
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

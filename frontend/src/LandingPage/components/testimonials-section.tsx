import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

const testimonials = [
  {
    quote: "Saved me hours on my database design assignment. The ERD came out exactly as I needed it.",
    name: "Sarah Chen",
    role: "Computer Science Student",
    company: "Stanford University",
  },
  {
    quote: "We use this for all our planning sessions now. Quick schema diagrams help the whole team stay aligned.",
    name: "Marcus Johnson",
    role: "Senior Backend Engineer",
    company: "TechStart Inc",
  },
  {
    quote: "My students grasp database concepts much faster when I can generate examples on the fly during lectures.",
    name: "Dr. Emily Rodriguez",
    role: "Associate Professor",
    company: "MIT",
  },
]

export function TestimonialsSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">What people are saying</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Trusted by students, engineers, and educators worldwide
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="bg-card border-border">
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-accent/30 mb-4" />
                <p className="text-foreground mb-6">{testimonial.quote}</p>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "What diagram types are supported?",
    answer:
      "We currently support Entity Relationship Diagrams (ERD), UML Class Diagrams, Sequence Diagrams, and Flowcharts. We're actively working on adding more diagram types like State Diagrams and User Journey maps.",
  },
  {
    question: "How accurate are the generated relationships?",
    answer:
      "Our AI model is trained on standard notation conventions and accurately interprets relationship descriptions. For complex scenarios, you can refine your prompt or use specific keywords like 'one-to-many' or 'extends' to ensure accurate representations.",
  },
  {
    question: "Can I edit the diagram after generating?",
    answer:
      "Yes, you can regenerate with an updated prompt to refine your diagram. We're also working on a visual editor that will let you make direct adjustments to the generated output.",
  },
  {
    question: "What export formats are available?",
    answer:
      "You can export your diagrams as PNG (raster format, great for documents and presentations) or SVG (vector format, perfect for scaling and further editing in design tools).",
  },
  {
    question: "Is my data stored or shared?",
    answer:
      "We take privacy seriously. Your prompts are processed to generate diagrams but are not stored permanently or used for training. Diagrams are only saved if you explicitly choose to save them to your account.",
  },
  {
    question: "Can I use the generated diagrams for coursework or commercial work?",
    answer:
      "Absolutely. All diagrams you generate are yours to use for any purpose—academic submissions, documentation, presentations, or commercial projects.",
  },
  {
    question: "Do you offer team or educational plans?",
    answer:
      "Yes, we offer discounted plans for educational institutions and team subscriptions with shared workspaces, collaboration features, and centralized billing.",
  },
  {
    question: "What if the generated diagram isn't quite right?",
    answer:
      "You can iterate by refining your prompt. Adding more specific details about entities, relationships, or the flow usually helps. Our examples section shows prompt patterns that work well for each diagram type.",
  },
]

export function FaqSection() {
  return (
    <section id="faq" className="px-4 py-20 sm:px-6 lg:px-8 bg-muted/20">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Frequently asked questions</h2>
          <p className="mt-4 text-lg text-muted-foreground">Everything you need to know about the product</p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-border">
              <AccordionTrigger className="text-left text-foreground hover:text-accent">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

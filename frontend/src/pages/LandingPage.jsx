import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  ChevronDown,
  Code2,
  Download,
  Github,
  GraduationCap,
  Grid3X3,
  History,
  Layers,
  Link2,
  Linkedin,
  ListFilter,
  Menu,
  PenLine,
  Quote,
  Share2,
  Sparkles,
  Twitter,
  Workflow,
  X,
  Zap,
} from 'lucide-react'

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#examples', label: 'Examples' },
  { href: '#faq', label: 'FAQ' },
]

const trustLogos = ['University of Tech', 'DevCorp', 'StartupX', 'CodeAcademy', 'DataFlow Inc']

const examples = [
  {
    title: 'Entity Relationship Diagram',
    description: 'Hospital management database schema with patients, doctors, and appointments',
    image: '/images/er-diagram.png',
    badge: 'ERD',
  },
  {
    title: 'UML Class Diagram',
    description: 'Object-oriented hospital system with classes, attributes, and relationships',
    image: '/images/class-diagram-20.png',
    badge: 'Class',
  },
  {
    title: 'Sequence Diagram',
    description: 'Patient visit flow from arrival through treatment to discharge',
    image: '/images/sequence-diagram-20.png',
    badge: 'Sequence',
  },
  {
    title: 'Flowchart',
    description: 'Decision flow for patient triage and department routing',
    image: '/images/prompt.png',
    badge: 'Flowchart',
  },
]

const features = [
  {
    icon: Zap,
    title: 'Text → Diagram instantly',
    description: 'Describe your system in plain text and get a professional diagram in seconds.',
  },
  {
    icon: Layers,
    title: 'Multiple diagram types',
    description: 'Support for ERD, UML class diagrams, sequence diagrams, and flowcharts.',
  },
  {
    icon: Download,
    title: 'Export PNG/SVG',
    description: 'Download your diagrams in high-quality PNG or scalable SVG format.',
  },
  {
    icon: Grid3X3,
    title: 'Consistent notation & layout',
    description: 'Auto-arranged layouts following standard notation conventions.',
  },
  {
    icon: Link2,
    title: 'Shareable links',
    description: 'Generate shareable links to collaborate with your team or class.',
  },
  {
    icon: History,
    title: 'History & versioning',
    description: 'Access previous versions and track changes to your diagrams.',
  },
]

const steps = [
  {
    number: '01',
    icon: PenLine,
    title: 'Write your prompt',
    description: 'Describe your entities, relationships, or interactions in plain text.',
    example:
      '"Create an ERD for a hospital system with patients, doctors, appointments, and medical records. Patients can have multiple appointments with different doctors."',
  },
  {
    number: '02',
    icon: ListFilter,
    title: 'Select diagram type',
    description: 'Choose from ERD, UML class diagram, sequence diagram, or flowchart.',
  },
  {
    number: '03',
    icon: Sparkles,
    title: 'Generate & export',
    description: 'Get your diagram instantly. Export as PNG or SVG for your documentation.',
  },
]

const useCases = [
  {
    id: 'students',
    icon: GraduationCap,
    title: 'Students',
    description: 'Perfect for database design assignments, software engineering projects, and thesis documentation.',
    examples: ['Database design coursework', 'Software architecture diagrams', 'Thesis and project documentation'],
  },
  {
    id: 'engineers',
    icon: Code2,
    title: 'Backend Engineers',
    description: 'Quickly visualize database schemas and system interactions during planning phases.',
    examples: ['Schema planning', 'API flow documentation', 'System integration diagrams'],
  },
  {
    id: 'analysts',
    icon: BarChart3,
    title: 'Product & Analysts',
    description: 'Map out user journeys, system flows, and business processes for stakeholder communication.',
    examples: ['User journey mapping', 'Process documentation', 'Stakeholder presentations'],
  },
  {
    id: 'instructors',
    icon: BookOpen,
    title: 'Instructors',
    description: 'Create clear teaching examples and visual aids for database and software engineering courses.',
    examples: ['Lecture materials', 'Assignment examples', 'Interactive demonstrations'],
  },
]

const testimonials = [
  {
    quote: 'Saved me hours on my database design assignment. The ERD came out exactly as I needed it.',
    name: 'Sarah Chen',
    role: 'Computer Science Student',
    company: 'Stanford University',
  },
  {
    quote: 'We use this for all our planning sessions now. Quick schema diagrams help the whole team stay aligned.',
    name: 'Marcus Johnson',
    role: 'Senior Backend Engineer',
    company: 'TechStart Inc',
  },
  {
    quote: 'My students grasp database concepts much faster when I can generate examples on the fly during lectures.',
    name: 'Dr. Emily Rodriguez',
    role: 'Associate Professor',
    company: 'MIT',
  },
]

const faqs = [
  {
    question: 'What diagram types are supported?',
    answer:
      'We currently support Entity Relationship Diagrams (ERD), UML Class Diagrams, Sequence Diagrams, and Flowcharts. We are actively working on additional diagram types like State Diagrams and User Journey maps.',
  },
  {
    question: 'How accurate are the generated relationships?',
    answer:
      'The AI is trained on standard notation conventions and interprets relationship descriptions accurately. For complex scenarios, refine your prompt or use keywords like one-to-many to guide the layout.',
  },
  {
    question: 'Can I edit the diagram after generating?',
    answer:
      'You can regenerate with an updated prompt to refine your diagram. A visual editor is on the roadmap to make direct adjustments even easier.',
  },
  {
    question: 'What export formats are available?',
    answer:
      'You can export diagrams as PNG for docs and presentations or SVG for scalable, design-tool-friendly assets.',
  },
  {
    question: 'Is my data stored or shared?',
    answer:
      'Prompts are processed to generate diagrams but are not stored permanently or used for training. Diagrams are only saved if you choose to store them in your account.',
  },
  {
    question: 'Can I use the generated diagrams for coursework or commercial work?',
    answer: 'Yes. All diagrams you generate are yours to use for academic, documentation, presentations, or commercial projects.',
  },
]

const diagramTypes = ['ERD', 'Class Diagram', 'Sequence Diagram', 'Flowchart']

function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <Workflow className="h-6 w-6 text-accent" />
          <span className="font-semibold text-foreground">AI System Modeling Generator</span>
        </Link>

        <div className="hidden md:flex md:items-center md:gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex md:items-center md:gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link to="/login">Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/app">Try the Demo</Link>
          </Button>
        </div>

        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="border-b border-border bg-background md:hidden">
          <div className="space-y-1 px-4 py-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block py-2 text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-4">
              <Button asChild variant="ghost" size="sm" className="w-full justify-center">
                <Link to="/login">Sign in</Link>
              </Button>
              <Button asChild size="sm" className="w-full">
                <Link to="/app">Try the Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

function ProductMockup() {
  const [selectedType, setSelectedType] = useState('Sequence Diagram')

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
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
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

function HeroSection() {
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
              <Button asChild size="lg" className="gap-2">
                <Link to="/app">
                  Try the Demo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2 bg-transparent">
                <a href="#examples">
                  View Examples
                  <ChevronDown className="h-4 w-4" />
                </a>
              </Button>
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

function ExamplesSection() {
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
                  src={example.image || '/images/placeholder.svg'}
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

function FeaturesSection() {
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

function HowItWorksSection() {
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

function UseCasesSection() {
  const [activeTab, setActiveTab] = useState('students')
  const activeCase = useCases.find((uc) => uc.id === activeTab)

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 bg-muted/20">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Built for everyone</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            From students to professionals, we have your diagramming needs covered
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {useCases.map((useCase) => (
            <button
              key={useCase.id}
              onClick={() => setActiveTab(useCase.id)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === useCase.id
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
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

function TestimonialsSection() {
  
}

function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="faq" className="px-4 py-20 sm:px-6 lg:px-8 bg-muted/20">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Frequently asked questions</h2>
          <p className="mt-4 text-lg text-muted-foreground">Everything you need to know about the product</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div key={faq.question} className="rounded-lg border border-border bg-card">
                <button
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-foreground"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                >
                  <span className="pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && <div className="px-4 pb-4 text-sm text-muted-foreground">{faq.answer}</div>}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function CtaSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <div className="rounded-2xl bg-card border border-border p-8 sm:p-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Turn text into diagrams—fast.</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Stop spending hours drawing diagrams manually. Describe your system and let AI do the rest.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="gap-2">
              <Link to="/app">
                Try the Demo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/signup">Create an account</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Workflow className="h-5 w-5 text-accent" />
            <span>AI System Modeling Generator</span>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-foreground">
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <a href="https://github.com" aria-label="GitHub" className="hover:text-foreground">
              <Github className="h-5 w-5" />
            </a>
            <a href="https://twitter.com" aria-label="Twitter" className="hover:text-foreground">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="https://linkedin.com" aria-label="LinkedIn" className="hover:text-foreground">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background bg-grid-pattern text-foreground">
      <LandingNavbar />
      <HeroSection />
      <ExamplesSection />
      <FeaturesSection />
      <HowItWorksSection />
      <UseCasesSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </div>
  )
}

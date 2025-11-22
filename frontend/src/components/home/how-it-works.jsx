import { MousePointerClick, Eye, MessageSquare } from "lucide-react"

const steps = [
  {
    title: "Select a Location",
    description: "Choose any building or area from the interactive campus map.",
    icon: MousePointerClick,
  },
  {
    title: "Enter 360° Mode",
    description: "Immerse yourself in high-fidelity panoramic views of the location.",
    icon: Eye,
  },
  {
    title: "Ask & Explore",
    description: "Let the AI assistant guide you or answer your questions about the facility.",
    icon: MessageSquare,
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Starting your virtual visit is as easy as 1-2-3.
          </p>
        </div>

        <div className="relative grid gap-8 md:grid-cols-3">
          {/* Connector line for desktop */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center text-center space-y-4 group">
              <div className="relative z-10 w-24 h-24 rounded-full bg-transparent border-2 border-primary/20 flex items-center justify-center mb-2 transition-all duration-300 group-hover:scale-110 group-hover:border-primary">
                <step.icon className="w-10 h-10 text-primary transition-all duration-300 group-hover:scale-110" />
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-background text-primary flex items-center justify-center font-bold text-sm border-2 border-primary transition-transform duration-300 group-hover:scale-110">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-xl font-bold mt-4 transition-colors duration-300 group-hover:text-primary">
                {step.title}
              </h3>
              <p className="text-muted-foreground max-w-xs mx-auto leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

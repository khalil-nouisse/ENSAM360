import { Map, View, Bot, Compass } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    title: "Interactive 2D Map",
    description: "Navigate the entire campus with a detailed, clickable map showing every building and facility.",
    icon: Map,
  },
  {
    title: "Immersive 360° View",
    description: "Step inside classrooms and labs with high-resolution 360° panoramic views.",
    icon: View,
  },
  {
    title: "AI Chatbot Guide",
    description: "Ask questions, get directions, or find specific departments with our intelligent assistant.",
    icon: Bot,
  },
  {
    title: "Smart Navigation",
    description: "Find the shortest path between any two points on campus instantly.",
    icon: Compass,
  },
]

export function FeaturesGrid() {
  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-balance">Everything you need to explore</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
            Our platform combines advanced mapping technology with AI to provide a seamless virtual experience.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="
                group border border-primary/20 shadow-none bg-transparent
                hover:border-primary
                transition-all duration-300 hover:-translate-y-1 hover:scale-105
              "
            >
              <CardHeader>
                <div
                  className="
                    w-12 h-12 rounded-2xl border border-primary/20 flex items-center justify-center mb-4
                    transition-all duration-300
                    group-hover:border-primary group-hover:scale-110
                  "
                >
                  <feature.icon
                    className="
                      w-6 h-6 text-primary
                      transition-all duration-300 group-hover:scale-110
                    "
                  />
                </div>

                <CardTitle className="text-xl transition-colors duration-300 group-hover:text-primary">
                  {feature.title}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <CardDescription className="text-base leading-relaxed transition-colors duration-300 group-hover:text-foreground/80">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

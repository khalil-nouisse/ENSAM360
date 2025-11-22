import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Cta() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-6 max-w-3xl mx-auto text-balance">
          Ready to explore ENSAM Meknès?
        </h2>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Join thousands of students and visitors who have already experienced our smart virtual campus.
        </p>
        <Button
          size="lg"
          className="text-lg h-14 px-8 rounded-full shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 hover:scale-110 hover:-translate-y-1"
          asChild
        >
          <Link href="/tour">
            Enter Virtual Tour
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </section>
  )
}

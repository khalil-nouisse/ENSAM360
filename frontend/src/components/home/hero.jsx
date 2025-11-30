import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowRight, Map } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 bg-background md:py-15">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <div className="flex flex-col items-start text-left space-y-8 my-[25px] animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center rounded-full border text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20 py-0.5 px-2.5 animate-in fade-in slide-in-from-bottom-4 duration-700">
              New: AI Campus Assistant
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-foreground">
              Explore ENSAM Meknès <span className="text-primary">Like Never Before</span>
            </h1>
            <p className="max-w-[42rem] text-lg text-muted-foreground sm:text-xl text-balance leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              Smart 360° virtual campus exploration with interactive maps and AI guidance. Navigate classrooms, labs,
              and facilities from anywhere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-10 duration-700 delay-500">
              <Button
                size="lg"
                className="text-base h-12 px-8 shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 text-primary-foreground"
                asChild
              >
                <Link to="/tour">
                  Start Virtual Tour
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base h-12 px-8 bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-300 hover:scale-105 text-foreground"
                asChild
              >
                <Link to="/map">
                  <Map className="mr-2 h-4 w-4" />
                  Explore the Map
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[600px] lg:max-w-none animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
            <div className="relative aspect-square lg:aspect-[4/3] overflow-hidden rounded-2xl border bg-muted/50 shadow-2xl">
              {/* Abstract representation of a 360 viewer or campus map */}
              <div className="absolute inset-0 bg-linear-to-br from-blue-100 via-indigo-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-black flex items-center justify-center">
                <div className="relative w-3/4 h-3/4 rounded-full border-4 border-primary/20 flex items-center justify-center animate-pulse">
                  <div className="w-1/2 h-1/2 rounded-full bg-primary/10 backdrop-blur-md border border-primary/30 flex items-center justify-center">
                    <Map className="w-16 h-16 text-primary opacity-50" />
                  </div>
                  {/* Orbiting elements */}
                  <div className="absolute w-full h-full rounded-full border border-dashed border-slate-300 dark:border-slate-700 animate-[spin_20s_linear_infinite]" />
                </div>

                {/* Floating badges */}
                <div className="absolute top-1/4 right-10 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg shadow-slate-200/50 dark:shadow-black/50 flex items-center gap-3 animate-[bounce_3s_infinite]">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-xs font-bold">Amphi A</span>
                </div>
                <div className="absolute bottom-1/4 left-10 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg shadow-slate-200/50 dark:shadow-black/50 flex items-center gap-3 animate-[bounce_4s_infinite]">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="text-xs font-bold">Library</span>
                </div>
              </div>
            </div>
            {/* Decorative background blob */}
            <div className="absolute -top-12 -right-12 -z-10 h-[300px] w-[300px] rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -bottom-12 -left-12 -z-10 h-[300px] w-[300px] rounded-full bg-blue-400/20 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  )
}

export function PreviewShowcase() {
  return (
    <section className="py-24 overflow-hidden bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="order-2 lg:order-1 relative">
            {/* Floating UI Mockups */}
            <div className="relative z-10 bg-transparent rounded-2xl border border-primary/20 p-2 rotate-[-2deg] hover:rotate-0 transition-all duration-500 hover:scale-105 max-w-md mx-auto lg:mr-auto hover:border-primary">
              <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden relative">
                {/* Mock Map Interface */}
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50 font-mono text-sm">
                  [ Interactive Map Interface ]
                </div>
                <div className="absolute bottom-4 left-4 right-4 h-12 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-md border flex items-center px-4 gap-3">
                  <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full" />
                  <div className="w-8 h-8 rounded-full bg-primary ml-auto" />
                </div>
              </div>
            </div>

            <div className="relative z-0 bg-transparent rounded-2xl border border-primary/20 p-2 rotate-[3deg] translate-x-12 -translate-y-24 max-w-md mx-auto lg:mr-auto hidden sm:block transition-all duration-500 hover:rotate-[5deg] hover:scale-105 hover:border-primary">
              <div className="aspect-video bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50 font-mono text-sm">
                  [ 360° Viewport ]
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-8">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl text-balance">
              Experience the campus from <span className="text-primary">any device</span>
            </h2>
            <div className="space-y-4 text-lg text-muted-foreground">
              <p>
                Whether you're on a desktop, tablet, or smartphone, our responsive platform adapts to give you the best
                viewing experience.
              </p>
              <ul className="grid gap-3 mt-4">
                <li className="flex items-center gap-3 transition-all duration-300 hover:translate-x-2">
                  <div className="h-2 w-2 rounded-full bg-primary transition-all duration-300 hover:scale-150" />
                  <span>High-definition 360° panoramic rendering</span>
                </li>
                <li className="flex items-center gap-3 transition-all duration-300 hover:translate-x-2">
                  <div className="h-2 w-2 rounded-full bg-primary transition-all duration-300 hover:scale-150" />
                  <span>Real-time pathfinding algorithms</span>
                </li>
                <li className="flex items-center gap-3 transition-all duration-300 hover:translate-x-2">
                  <div className="h-2 w-2 rounded-full bg-primary transition-all duration-300 hover:scale-150" />
                  <span>Voice-activated AI commands</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

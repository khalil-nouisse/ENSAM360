import { SiteHeader } from "@/components/home/site-header"
import { Hero } from "@/components/home/hero"
import { FeaturesGrid } from "@/components/home/features-grid"
import { HowItWorks } from "@/components/home/how-it-works"
import { PreviewShowcase } from "@/components/home/preview-showcase"
import { Cta } from "@/components/home/cta"
import { SiteFooter } from "@/components/home/site-footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/10 selection:text-primary">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <FeaturesGrid />
        <HowItWorks />
        <PreviewShowcase />
        <Cta />
      </main>
      <SiteFooter />
    </div>
  )
}


import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { GraduationCap } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60 dark:bg-background/60 dark:border-border">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link
          to="/home"
          className="flex items-center gap-2 font-bold text-xl text-primary hover:opacity-90 transition-opacity"
        >
          <GraduationCap className="h-6 w-6" />
          <span>ENSAM360°</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link to="/home#features" className="hover:text-foreground transition-colors">
            Features
          </Link>
          <Link to="/home#how-it-works" className="hover:text-foreground transition-colors">
            How It Works
          </Link>
          <Link to="/map" className="hover:text-foreground transition-colors">
            Map
          </Link>
          <Link to="/home#about" className="hover:text-foreground transition-colors">
            About
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <Button variant="ghost" className="hidden sm:flex text-foreground" asChild>
            <Link to="/auth">Log in</Link>
          </Button>
          <Button asChild>
            <Link to="/tour">Start Tour</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

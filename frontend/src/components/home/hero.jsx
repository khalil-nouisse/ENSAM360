import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowRight, Map } from "lucide-react"

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#F8FAFC] dark:bg-[#0B0E14] transition-colors duration-300">

      {/* 1. Background Pattern (Circuit/Map) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{ maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)' }}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M100 0 H 0 V 100" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      <div className="container relative z-10 mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[85vh]">

        {/* 2. THE ORBIT CONTAINER */}
        {/* We use a specific Aspect Ratio to force the "Cinematic Wide" look */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] md:w-full max-w-[1300px] aspect-[2/1] pointer-events-none">
          <svg
            viewBox="0 0 1400 800"
            className="w-full h-full visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="orbit-gradient" gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>

              <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="7" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* THE "STRAIGHT STADIUM" PATH */}
            {/* Removed rotation. Top line is y=120. Bottom line is y=680. Strictly Horizontal. */}
            <path
              id="orbitPath"
              d="M 400 120 
       L 1000 120
       C 1350 120, 1350 680, 1000 680
       L 400 680
       C 50 680, 50 120, 400 120 Z"
              stroke="url(#orbit-gradient)"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
              filter="url(#neon-glow)"
              className="opacity-90 dark:opacity-100"
            />

            {/* SATELLITE ANIMATION */}
            <circle r="5" fill="white" filter="url(#neon-glow)">
              <animateMotion dur="14s" repeatCount="indefinite" rotate="auto">
                <mpath href="#orbitPath" />
              </animateMotion>
            </circle>

            {/* --- NODES (Perfectly aligned to the straight lines) --- */}

            {/* NODE 1: AMPHI A (Top Center) */}
            {/* y=120 (Exact line height) */}
            <g className="cursor-pointer pointer-events-auto group">
              <circle cx="700" cy="120" r="9" fill="#22c55e" stroke="white" strokeWidth="2" className="animate-pulse" />
              <foreignObject x="580" y="50" width="240" height="60" className="overflow-visible">
                <div className="flex justify-center transition-transform duration-300 group-hover:scale-110">
                  <span className="px-5 py-2 bg-[#22c55e] text-white text-xs font-bold uppercase rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.6)] tracking-wider">
                    Amphi A
                  </span>
                </div>
              </foreignObject>
            </g>

            {/* NODE 2: LIBRARY (Bottom Left) */}
            {/* y=680 (Exact line height) */}
            <g className="cursor-pointer pointer-events-auto group">
              <circle cx="350" cy="680" r="9" fill="#3b82f6" stroke="white" strokeWidth="2" className="animate-pulse" />
              <foreignObject x="230" y="700" width="240" height="60" className="overflow-visible">
                <div className="flex justify-center transition-transform duration-300 group-hover:scale-110">
                  <span className="px-5 py-2 bg-[#3b82f6] text-white text-xs font-bold uppercase rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.6)] tracking-wider">
                    Library
                  </span>
                </div>
              </foreignObject>
            </g>

            {/* NODE 3: AI LAB (Bottom Right) */}
            {/* y=680 (Exact line height) */}
            <g className="cursor-pointer pointer-events-auto group">
              <circle cx="1050" cy="680" r="9" fill="#ec4899" stroke="white" strokeWidth="2" className="animate-pulse" />
              <foreignObject x="930" y="700" width="240" height="60" className="overflow-visible">
                <div className="flex justify-center transition-transform duration-300 group-hover:scale-110">
                  <span className="px-5 py-2 bg-[#ec4899] text-white text-xs font-bold uppercase rounded-lg shadow-[0_0_15px_rgba(236,72,153,0.6)] tracking-wider">
                    AI Research Lab
                  </span>
                </div>
              </foreignObject>
            </g>
          </svg>
        </div>

        {/* 3. CENTER CONTENT (Grouped tight to fit in the flatter ring) */}
        <div className="relative z-20 text-center space-y-6 max-w-4xl -mt-8">

          <div className="inline-flex items-center rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-[10px] font-bold text-green-600 dark:text-green-400 backdrop-blur-md">
            NEW: AI CAMPUS ASSISTANT
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white drop-shadow-2xl">
            Explore ENSAM Meknès <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-pink-400">
              Like Never Before
            </span>
          </h1>

          <p className="text-slate-600 dark:text-slate-300 max-w-xl mx-auto text-lg">
            Smart 360° virtual campus exploration with interactive maps and AI guidance.
          </p>

          <div className="flex flex-row justify-center gap-4 pt-2">
            <Button className="rounded-full bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 px-8 h-12">
              <Link to="/tour" className="flex items-center">Start Virtual Tour <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
            <Button variant="ghost" className="rounded-full border border-slate-700 hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 h-12 px-6">
              <Link to="/map" className="flex items-center"><Map className="mr-2 w-4 h-4" /> Explore Map</Link>
            </Button>
          </div>

        </div>
      </div>
    </section>
  )
}
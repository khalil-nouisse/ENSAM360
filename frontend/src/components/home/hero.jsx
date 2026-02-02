import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Map } from "lucide-react";

export function Hero() {
  const animationDuration = "14s";

  // --- TYPEWRITER LOGIC ---
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(80);

  const messages = [
    "A smarter way to find your way",
    "An immersive 360° campus experience",
    "AI-powered navigation, made simple",
    "Your digital guide across campus"
  ];

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % messages.length;
      const fullText = messages[i];

      setText(isDeleting
        ? fullText.substring(0, text.length - 1)
        : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? 30 : 80);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(500);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed, messages]);

  return (
    <section className="relative w-full h-screen min-h-[850px] overflow-hidden bg-background text-foreground flex flex-col items-center justify-center transition-colors duration-300 font-sans">

      {/* 1. BACKGROUND ATMOSPHERE */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-background via-background/80"
          style={{ background: 'radial-gradient(circle at center, transparent 30%, hsl(var(--background)) 80%)' }}
        ></div>
      </div>

      {/* 2. THE SVG LAYER */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none -translate-y-12 md:-translate-y-16">
        <svg
          viewBox="0 0 1400 800"
          className="w-full h-full max-w-[1400px]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="comet-gradient"
              gradientUnits="userSpaceOnUse"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>

            <linearGradient id="fade-mask-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="black" />
              <stop offset="40%" stopColor="black" />
              <stop offset="100%" stopColor="white" />
            </linearGradient>

            <filter id="head-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <path
              id="stadium-track"
              d="M 400 120 
                 L 1000 120
                 C 1350 120, 1350 680, 1000 680
                 L 400 680
                 C 50 680, 50 120, 400 120 Z"
            />

            <mask id="comet-mask">
              <rect x="-2000" y="-2000" width="4000" height="4000" fill="black" />
              <g>
                <rect
                  x="-450" y="-20"
                  width="450" height="40"
                  fill="url(#fade-mask-gradient)"
                />
                <animateMotion
                  dur={animationDuration}
                  repeatCount="indefinite"
                  rotate="auto"
                  calcMode="linear"
                  keyPoints="0;1"
                  keyTimes="0;1"
                >
                  <mpath href="#stadium-track" />
                </animateMotion>
              </g>
            </mask>
          </defs>

          {/* BASE TRACK */}
          <use
            href="#stadium-track"
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted-foreground/20"
          />

          {/* COMET TAIL */}
          <use
            href="#stadium-track"
            stroke="url(#comet-gradient)"
            strokeWidth="4"
            strokeLinecap="round"
            mask="url(#comet-mask)"
            style={{ filter: "drop-shadow(0px 0px 6px rgba(59, 130, 246, 0.5))" }}
          />

          {/* COMET HEAD */}
          <circle r="6" filter="url(#head-glow)" className="fill-black dark:fill-white transition-colors duration-300">
            <animateMotion
              dur={animationDuration}
              repeatCount="indefinite"
              rotate="auto"
              calcMode="linear"
              keyPoints="0;1"
              keyTimes="0;1"
            >
              <mpath href="#stadium-track" />
            </animateMotion>
          </circle>

          {/* STATIC STATIONS */}
          <g className="opacity-80 hover:opacity-100 transition-opacity duration-300">
            <circle cx="700" cy="120" r="4" className="fill-background stroke-green-500" strokeWidth="2" />
            <foreignObject x="550" y="140" width="300" height="50">
              <div className="flex justify-center">
                <span className="text-green-500 text-[10px] font-bold tracking-[0.3em] uppercase font-sans">
                  Amphi A
                </span>
              </div>
            </foreignObject>
          </g>

          <g className="opacity-80 hover:opacity-100 transition-opacity duration-300">
            <circle cx="380" cy="680" r="4" className="fill-background stroke-blue-500" strokeWidth="2" />
            <foreignObject x="230" y="710" width="300" height="50">
              <div className="flex justify-center">
                <span className="text-blue-500 text-[10px] font-bold tracking-[0.3em] uppercase font-sans">
                  Library
                </span>
              </div>
            </foreignObject>
          </g>

          <g className="opacity-80 hover:opacity-100 transition-opacity duration-300">
            <circle cx="1020" cy="680" r="4" className="fill-background stroke-pink-500" strokeWidth="2" />
            <foreignObject x="870" y="710" width="300" height="50">
              <div className="flex justify-center">
                <span className="text-pink-500 text-[10px] font-bold tracking-[0.3em] uppercase font-sans">
                  AI Research Lab
                </span>
              </div>
            </foreignObject>
          </g>
        </svg>
      </div>

      {/* 3. CENTERED CONTENT */}
      {/* Increased negative margin slightly to ensure perfect optical center */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-6 max-w-5xl px-4 -mt-24 md:-mt-32">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/20 bg-green-500/5 backdrop-blur-md mb-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-[10px] md:text-xs font-semibold text-green-500 tracking-wide uppercase">
            New: AI Campus Assistant
          </span>
        </div>

        {/* HEADLINE BLOCK */}
        <div className="flex flex-col items-center">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-tight drop-shadow-2xl">
            Explore ENSAM360°
          </h1>

          {/* TYPEWRITER CONTAINER - FIXED HEIGHT prevents layout shift */}
          <div className="h-[40px] md:h-[80px] flex items-center justify-center mt-2 md:mt-4">
            <span className="
              font-plex
              text-2xl sm:text-3xl md:text-5xl
              font-medium
              tracking-tight
              text-muted-foreground
            ">
              {text}
              <span className="
                inline-block
                w-[2px] md:w-[3px]
                h-[1em]
                bg-green-400/80
                ml-1
                align-middle
                animate-pulse
              " />
            </span>
          </div>
        </div>

        {/* Description - Added padding to prevent overlapping */}
        <p className="
          max-w-xl
          font-inter
          text-base md:text-lg
          text-muted-foreground
          font-normal
          leading-relaxed
        ">
          Smart 360° virtual campus exploration with interactive maps and AI
          guidance. Navigate classrooms, labs, and facilities from anywhere.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <Button
            size="lg"
            className="rounded-full px-8 font-semibold text-base transition-all hover:scale-105 shadow-lg shadow-green-500/10"
            asChild
          >
            <Link to="/tour" className="flex items-center gap-2">
              Start Virtual Tour <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="rounded-full px-8 text-base bg-background/50 backdrop-blur-sm border-muted transition-all hover:bg-muted/20 hover:scale-105"
            asChild
          >
            <Link to="/map" className="flex items-center gap-2">
              <Map className="w-4 h-4" /> Explore the Map
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
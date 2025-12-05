import { useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";

const technologies = [
    { name: 'React.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    { name: 'Express.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', darkLogo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original-wordmark.svg' },
    { name: 'Tailwind CSS', logo: '/tailwind-logo.png' },
    { name: 'Neo4j Aura', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/neo4j/neo4j-original.svg' },
    { name: 'Cloudinary', logo: '/cloudinary-logo.png' },
    { name: 'Docker', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
];

// Duplicate the array to ensure seamless looping
const techList = [...technologies, ...technologies, ...technologies];

export function TechStack() {
    return (
        <div className="w-full py-8 overflow-hidden bg-background/50 border-b border-primary/10 mb-12">
            <div className="container mx-auto px-4 mb-6 text-center">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Powered By Modern Technologies</p>
            </div>

            <div className="relative w-full flex overflow-hidden mask-linear-gradient">
                <div className="flex animate-scroll whitespace-nowrap gap-12 md:gap-24 items-center">
                    {techList.map((tech, index) => (
                        <div key={index} className="flex flex-col items-center justify-center gap-3 group min-w-[100px]">
                            <div className="w-12 h-12 md:w-16 md:h-16 relative flex items-center justify-center transition-transform duration-300 group-hover:scale-110 grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100">
                                {/* Light Mode Logo */}
                                <img
                                    src={tech.logo}
                                    alt={tech.name}
                                    className={cn("w-full h-full object-contain", tech.darkLogo ? "dark:hidden" : "")}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'block';
                                    }}
                                />
                                {/* Dark Mode Logo (if available) */}
                                {tech.darkLogo && (
                                    <img
                                        src={tech.darkLogo}
                                        alt={tech.name}
                                        className="w-full h-full object-contain hidden dark:block"
                                    />
                                )}
                                <span className="hidden text-xs font-bold text-primary">{tech.name}</span>
                            </div>
                            <span className="text-xs md:text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">{tech.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
        .mask-linear-gradient {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
        </div>
    );
}

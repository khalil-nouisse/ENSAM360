import React, { useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function NavigationHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = ['Home', 'Features', 'Discover', 'About'];

  const handleAuthClick = () => {
    navigate("/auth");
  };

  return (
    <div className="w-full pt-8 fixed top-0 z-50">
      <nav className="w-11/12 md:w-5/7 mx-auto rounded-2xl bg-background/80 backdrop-blur-md border border-border shadow-sm">
        <div className="px-9 py-2">
          <div className="flex items-center justify-between">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-center space-x-12 flex-1">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-lg font-medium transition-colors duration-200 hover:text-primary text-foreground/80"
                >
                  {item}
                </a>
              ))}
            </div>

            {/* CTA Button */}
            <Button
              className="hidden md:flex items-center justify-center w-12 h-12 rounded-full p-0"
              onClick={handleAuthClick}
            >
              <ArrowUpRight className="w-6 h-6" />
            </Button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-6 space-y-4 pb-4 animate-in slide-in-from-top-2">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block text-xl font-medium transition-colors duration-200 text-foreground hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <Button
                className="w-full rounded-full"
                onClick={handleAuthClick}
              >
                Get Started
                <ArrowUpRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
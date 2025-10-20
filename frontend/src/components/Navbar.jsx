import React, { useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';

export default function NavigationHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = ['Home', 'Features', 'Discover', 'About'];

  return (
    <div className="w-full pt-8">
      <nav className="w-11/12 md:w-5/7 mx-auto rounded-2xl" style={{ backgroundColor: 'white' }}>
        <div className="px-9 py-2">
          <div className="flex items-center justify-between">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-center space-x-12 flex-1">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-2xl font-medium transition-colors duration-200 hover:opacity-70"
                  style={{ color: '#151A28' }}
                >
                  {item}
                </a>
              ))}
            </div>

            {/* CTA Button */}
            <button
              className="hidden md:flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 hover:opacity-90"
              style={{ backgroundColor: '#213985' }}
            >
              <ArrowUpRight className="w-6 h-6" style={{ color: '#F1E8DD' }} />
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{ color: '#151A28' }}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-6 space-y-4 pb-4">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block text-xl font-medium transition-colors duration-200"
                  style={{ color: '#151A28' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <button
                className="flex items-center justify-center w-full py-3 rounded-full transition-all duration-200"
                style={{ backgroundColor: '#213985', color: '#F1E8DD' }}
              >
                Get Started
                <ArrowUpRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
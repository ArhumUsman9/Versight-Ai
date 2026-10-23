import React from 'react';
import { ShieldCheck, Lock, Activity, Menu, X } from 'lucide-react';
import { PageView } from '../types';

interface HeaderProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navItems: { id: PageView; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'technology', label: 'Technology' },
    { id: 'vision', label: 'Vision' },
  ];

  return (
    <header className="border-b border-forensic-700 bg-forensic-900/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div 
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => onNavigate('home')}
        >
          <div className="bg-forensic-accent/20 p-2 rounded-lg border border-forensic-accent/30 group-hover:bg-forensic-accent/30 transition-all">
            <ShieldCheck className="h-6 w-6 text-forensic-accent" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">VeriSight<span className="text-forensic-accent">-AI</span></h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-400">Forensic Intelligence</p>
          </div>
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 
                ${currentPage === item.id 
                  ? 'text-white bg-forensic-800 border border-forensic-700 shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-forensic-800/50'
                }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Status Indicators */}
        <div className="hidden lg:flex items-center space-x-6 text-sm">
          <div className="flex items-center text-emerald-400 space-x-2 bg-emerald-950/30 px-3 py-1 rounded-full border border-emerald-900/50">
            <Lock className="h-3 w-3" />
            <span className="font-mono text-xs">SECURE_ENV</span>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-slate-300 hover:text-white"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-forensic-900 border-b border-forensic-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium
                  ${currentPage === item.id 
                    ? 'text-white bg-forensic-800' 
                    : 'text-slate-400 hover:text-white hover:bg-forensic-800/50'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

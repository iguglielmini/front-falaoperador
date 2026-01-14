'use client';

import { useState } from "react";
import Link from "next/link";
// import { Link, useLocation } from "react-router-dom";
import { Menu, X, Radio, Youtube, Instagram, } from "lucide-react";
import { Button } from "@/components/ui/button";

// const navLinks = [
//   { href: "/", label: "Base" },
//   { href: "/sobre", label: "Briefing" },
//   { href: "/episodios", label: "Transmissões" },
//   { href: "/equipe", label: "Operadores" },
//   { href: "/eventos", label: "Operações" },
//   { href: "/calendario", label: "Timeline" },
//   { href: "/contato", label: "Contato" },
// ];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
//   const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
              <div className="absolute inset-0 bg-sand/20 rounded-sm rotate-45 group-hover:rotate-0 transition-transform duration-300" />
              <Radio className="w-5 h-5 md:w-6 md:h-6 text-sand relative z-10" />
            </div>
            <div className="flex flex-col">
              <span className="font-orbitron text-sm md:text-base font-bold text-foreground tracking-widest">
                FALA OPERADOR
              </span>
              <span className="text-[10px] md:text-xs text-muted-foreground tracking-wider uppercase">
                Podcast Tático
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          {/* <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3 py-2 text-xs font-orbitron tracking-wider uppercase transition-all duration-300 hover:text-sand ${
                  location.pathname === link.href
                    ? "text-sand border-b-2 border-sand"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav> */}

          {/* Social & Admin */}
          <div className="hidden md:flex items-center gap-2">
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-muted-foreground hover:text-sand transition-colors"
            >
              <Youtube className="w-5 h-5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-muted-foreground hover:text-sand transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <Button variant="outline" size="sm" className="ml-2" asChild>
              <Link href="/login">
                Dashboard
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-foreground"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-background border-b border-border animate-fade-in">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {/* {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-3 text-sm font-orbitron tracking-wider uppercase transition-all ${
                  location.pathname === link.href
                    ? "text-sand bg-navy-light"
                    : "text-muted-foreground hover:bg-navy-light hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))} */}
            <div className="flex items-center gap-4 px-4 py-3 border-t border-border mt-2">
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-sand"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-sand"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <Button variant="outline" size="sm" className="ml-auto" asChild>
                <Link href="/login">
                  Dashboard
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

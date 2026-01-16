'use client';
import { useState } from "react";
import Link from "next/link";
import { Menu, X, Radio, Youtube, Instagram, } from "lucide-react";
import { Button } from "@/components/ui/button";


export function Header() {
  const [isOpen, setIsOpen] = useState(false);

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
                Área Administrativa
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
                  Área Administrativa
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

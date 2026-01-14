import Image from "next/image";
import falaLogo from "@/assets/pdc-icon.png";
import { Button } from "@/components/ui/button";
import { TacticalCard } from "@/components/shared/TaticalCard";
import {
  Radio,
  Youtube,
  Instagram,
  Headphones,
  Play,
  Calendar,
  Users,
  Target,
  ChevronRight,
  Mic,
  Signal,
} from "lucide-react";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { Header } from "@/components/layout/Header";

// Sample data for episodes
const recentEpisodes = [
  {
    id: 1,
    title: "Táticas de Comunicação em Campo",
    description:
      "Discutimos as melhores práticas de comunicação durante operações táticas.",
    thumbnail:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=225&fit=crop",
    duration: "1h 23min",
  },
  {
    id: 2,
    title: "Equipamentos Essenciais para Airsoft",
    description:
      "Review completo dos equipamentos mais importantes para sua loadout.",
    thumbnail:
      "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=400&h=225&fit=crop",
    duration: "58min",
  },
  {
    id: 3,
    title: "Estratégias de Equipe em Operações",
    description: "Como montar e coordenar uma equipe eficiente em campo.",
    thumbnail:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=225&fit=crop",
    duration: "1h 05min",
  },
];

const teamMembers = [
  {
    name: "Operador Alpha",
    role: "Host Principal",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "Operador Bravo",
    role: "Co-Host",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "Operador Charlie",
    role: "Produtor",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
  },
];

const upcomingEvents = [
  {
    date: "15 JAN",
    title: "Gravação Especial - Operação Delta",
    type: "Gravação",
  },
  {
    date: "22 JAN",
    title: "Encontro de Operadores SP",
    type: "Evento",
  },
  {
    date: "28 JAN",
    title: "Live com Convidado Especial",
    type: "Live",
  },
];
export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-military-gradient" />
        <div className="absolute inset-0 bg-radar-gradient opacity-50" />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(38, 40%, 55%) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(38, 40%, 55%) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Scanline Effect */}
        <div className="absolute inset-0 scanline pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-navy-light/80 border border-sand/30 mb-8 animate-fade-in">
              <Signal className="w-4 h-4 text-tactical-green animate-pulse" />
              <span className="text-xs font-orbitron tracking-widest text-sand uppercase">
                Transmissão Ativa
              </span>
            </div>

            {/* Logo Icon */}
            <div
              className="relative w-80 h-80 mx-auto animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              <Image
                src={falaLogo}
                alt="Fala Operador Logo"
                className="absolute inset-0 w-full h-full object-contain drop-shadow-lg"
                style={{ pointerEvents: "none" }}
                fill
                priority
              />
            </div>

            {/* Title */}
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-orbitron font-black text-foreground mb-6 tracking-wider animate-fade-in text-glow"
              style={{ animationDelay: "0.2s" }}
            >
              FALA OPERADOR
            </h1>

            {/* Subtitle */}
            <p
              className="text-xl md:text-2xl text-muted-foreground mb-4 font-light animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              Onde operadores compartilham experiência
            </p>

            {/* Tagline */}
            <div
              className="inline-flex items-center gap-4 text-sm text-sand font-orbitron tracking-widest mb-12 animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              <span>TÁTICO</span>
              <div className="w-2 h-2 bg-sand rotate-45" />
              <span>ESTRATÉGICO</span>
              <div className="w-2 h-2 bg-sand rotate-45" />
              <span>OPERACIONAL</span>
            </div>

            {/* CTA Buttons */}
            <div
              className="flex flex-wrap items-center justify-center gap-4 animate-fade-in"
              style={{ animationDelay: "0.5s" }}
            >
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="tactical" size="xl" className="gap-3">
                  <Youtube className="w-5 h-5" />
                  YouTube
                </Button>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="military" size="xl" className="gap-3">
                  <Instagram className="w-5 h-5" />
                  Instagram
                </Button>
              </a>
              <Button variant="outline" size="xl" className="gap-3">
                <Headphones className="w-5 h-5" />
                Ouvir Episódios
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sand/50 to-transparent" />
      </section>
    </div>
  );
}

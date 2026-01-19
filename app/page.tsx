import Image from "next/image";
import Link from "next/link";
import falaLogo from "@/assets/pdc-icon.png";
import { Button } from "@/components/ui/button";
import { 
  Youtube, 
  Instagram, 
  Headphones, 
  Signal, 
  Calendar,
  ArrowRight,
  Play
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { EventosCarousel } from "@/components/shared/EventosCarousel";
import { SectionTitle } from "@/components/shared/SectionTitle";

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
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-sand/50 to-transparent" />
      </section>

      {/* Latest Episode Section */}
      <SectionTitle variant="dark" badge={{ icon: Play, label: "Último Episódio" }}>
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-orbitron font-bold mb-4 tracking-wide">
                EPISÓDIO RECENTE
              </h2>
              <p className="text-lg max-w-2xl mx-auto opacity-80">
                Confira nossa última transmissão
              </p>
            </div>

            {/* Video Container */}
            <div className="relative aspect-video bg-navy-light border-2 border-sand/20 overflow-hidden group hover:border-sand/40 transition-all duration-300">
              {/* YouTube Embed */}
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/n7NYV2AkVd0?si=T7G94kmsjrmVqqgN"
                title="Fala Operador - Episódio Recente"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-tactical-green opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-tactical-green opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-tactical-green opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-tactical-green opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Episode Info */}
            <div className="mt-8 text-center">
              <a
                href="https://youtube.com/@FalaOperadorPodcast"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="tactical" size="lg" className="gap-3">
                  <Youtube className="w-5 h-5" />
                  Ver Todos os Episódios
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </SectionTitle>

      {/* Upcoming Events Section */}
      <SectionTitle variant="light" badge={{ icon: Calendar, label: "Próximas Missões" }}>
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-orbitron font-bold mb-4 tracking-wide">
                EVENTOS
              </h2>
              <p className="text-lg max-w-2xl mx-auto opacity-80">
                Onde o Fala Operador estará presente
              </p>
            </div>

            {/* Events Grid */}
            <EventosCarousel />

            {/* CTA */}
            <div className="text-center mt-8">
              <Link href="/dashboard/eventos">
                <Button variant="outline" size="lg" className="gap-3">
                  <Calendar className="w-5 h-5" />
                  Ver Todos os Eventos
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </SectionTitle>
    </div>
  );
}

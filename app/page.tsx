import Image from "next/image";
import Link from "next/link";
import falaLogo from "@/assets/pdc-icon.png";
import podcast from "@/assets/podcast.jpeg";
import { SaibaMaisButton } from "@/components/SaibaMaisButton";
import { Button } from "@/components/ui/button";
import {
  Youtube,
  Instagram,
  Signal,
  Calendar,
  ArrowRight,
  Play,
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
            {/* Botão para Sobre Nós */}
            <SaibaMaisButton />
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-sand/50 to-transparent" />
      </section>

      {/* Sobre Nós Section */}
      <SectionTitle
        variant="dark"
        badge={{ icon: Signal, label: "Sobre nós" }}
      >
        <div id="sobre-nos" className="container mx-auto px-4 scroll-mt-24">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16">
            {/* Texto */}
            <div className="flex-1 text-center md:text-left animate-fade-in-down">
              <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4 tracking-wide text-sand">
                Sobre nós
              </h2>
              <p className="text-lg text-sand/80 whitespace-pre-line">
                O Fala Operador nasceu porque faltava um lugar onde o operador
                fosse protagonista, independente de sua idade. Toda semana
                temos um episódio novo. Nosso público é ativo, conectado e
                pronto para interagir com marcas autênticas. Conteúdo real,
                leve e representativo, conectando comunidade, marcas e
                eventos.Se é do jogo, a gente troca ideia.
              </p>
            </div>
            {/* Imagem */}
            <div className="flex-1 flex justify-center animate-fade-in-up">
              <Image
                src={podcast}
                alt="Equipe Fala Operador"
                width={450}
                height={340}
                className="rounded-xl shadow-lg object-contain bg-navy-light border border-sand/20"
                priority={false}
              />
            </div>
          </div>
        </div>
      </SectionTitle>

      {/* Latest Episode Section */}
      <SectionTitle
        variant="light"
        badge={{ icon: Play, label: "Último Episódio" }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12 animate-fade-in-down">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-orbitron font-bold mb-4 tracking-wide">
                EPISÓDIO RECENTE
              </h2>
              <p className="text-lg max-w-2xl mx-auto opacity-80">
                Confira nossa última transmissão
              </p>
            </div>

            {/* Video Container */}
            <div className="relative aspect-video bg-navy-light border-2 border-sand/20 overflow-hidden group hover:border-sand/40 transition-all duration-300 animate-fade-in-up animate-delay-100">
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
            <div className="mt-8 text-center animate-fade-in animate-delay-200">
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
      <SectionTitle
        variant="dark"
        badge={{ icon: Calendar, label: "Próximas Missões" }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12 animate-fade-in-down">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-orbitron font-bold mb-4 tracking-wide">
                EVENTOS
              </h2>
              <p className="text-lg max-w-2xl mx-auto opacity-80">
                Onde o Fala Operador estará presente
              </p>
            </div>

            {/* Events Grid */}
            <div className="animate-fade-in-up animate-delay-100">
              <EventosCarousel />
            </div>

            {/* CTA */}
            <div className="text-center mt-8 animate-fade-in animate-delay-200">
              <Link href="/dashboard/eventos">
                <Button variant="tactical" size="lg" className="gap-3">
                  <Calendar className="w-5 h-5" />
                  Ver Todos os Eventos
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </SectionTitle>

      {/* Contact Section */}
      <SectionTitle variant="light" badge={{ icon: Signal, label: "Contato" }}>
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4 tracking-wide text-sand">
            Contato
          </h2>
          <p className="text-lg text-sand/80 mb-8">
            Fale com a equipe do Fala Operador para parcerias, dúvidas,
            sugestões ou convites para eventos.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
            <a
              href="mailto:contato@falaoperador.com"
              className="flex items-center gap-3 text-sand hover:text-tactical-green transition-colors text-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm0 0v4m0-4V8"
                />
              </svg>
              contato@falaoperador.com
            </a>
            <a
              href="https://wa.me/5581999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sand hover:text-tactical-green transition-colors text-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16.72 11.06a6.5 6.5 0 10-5.66 5.66l2.12.53a1 1 0 001.18-1.18l-.53-2.12z"
                />
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </SectionTitle>

      {/* Footer */}
      <footer className="w-full bg-navy-light border-t border-sand/20 py-3 mt-10 animate-fade-in-up animate-delay-300">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Image
              src={falaLogo}
              alt="Fala Operador Logo"
              width={40}
              height={40}
              className="rounded-sm"
            />
            <span className="font-orbitron text-lg font-bold tracking-widest text-sand">
              FALA OPERADOR
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://youtube.com/@FalaOperadorPodcast"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sand hover:text-tactical-green transition-colors"
            >
              <Youtube className="w-6 h-6" />
            </a>
            <a
              href="https://instagram.com/falaoperador"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sand hover:text-tactical-green transition-colors"
            >
              <Instagram className="w-6 h-6" />
            </a>
          </div>
          <div className="text-xs text-sand/70 text-center md:text-right">
            © {new Date().getFullYear()} Fala Operador Podcast. Todos os
            direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}

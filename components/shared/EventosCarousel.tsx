"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Calendar,
  Clock,
  MapPin,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate, formatTime } from "@/lib/utils/date-format";
import defaultEventImage from "@/assets/pdc-icon.png";
import { ViewEventoModal } from "@/components/eventos/ViewEventoModal";
import { Evento } from "@/contexts/EventosContext";

export function EventosCarousel() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchEventos();
  }, []);

  // Auto-transition a cada 10 segundos
  useEffect(() => {
    if (eventos.length <= 2) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => {
          const totalPages = Math.ceil(eventos.length / 2);
          const nextPage = (Math.floor(prev / 2) + 1) % totalPages;
          return nextPage * 2;
        });
        setIsAnimating(false);
      }, 300);
    }, 10000);

    return () => clearInterval(interval);
  }, [eventos]);

  const fetchEventos = async () => {
    try {
      // Buscar apenas eventos públicos futuros
      const response = await fetch("/api/eventos");
      if (response.ok) {
        const result = await response.json();
        const eventosPublicos = result.data
          .filter((evento: Evento) => evento.visibilidade === "PUBLICA")
          .filter((evento: Evento) => new Date(evento.dataInicio) >= new Date())
          .sort(
            (a: Evento, b: Evento) =>
              new Date(a.dataInicio).getTime() -
              new Date(b.dataInicio).getTime(),
          )
          .slice(0, 6); // Limitar a 6 eventos

        setEventos(eventosPublicos);
      }
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoriaStyle = (categoria: string) => {
    const styles = {
      PODCAST: "bg-orange-500/20 border-orange-500/50 text-orange-500",
      LIVE: "bg-red-500/20 border-red-500/50 text-red-500",
      EVENTO: "bg-blue-500/20 border-blue-500/50 text-blue-500",
      ENTREVISTA: "bg-purple-500/20 border-purple-500/50 text-purple-500",
      OUTRO: "bg-sand/20 border-sand/50 text-sand",
    };
    return styles[categoria as keyof typeof styles] || styles.OUTRO;
  };

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-64 bg-navy-light/50 border border-sand/20 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (eventos.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-16 h-16 text-sand/30 mx-auto mb-4" />
        <p className="text-muted-foreground text-lg">
          Nenhum evento público agendado no momento
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Fique ligado nas nossas redes sociais para novidades!
        </p>
      </div>
    );
  }

  // Mostrar 2 cards por vez no desktop
  const visibleEvents = eventos.slice(currentIndex, currentIndex + 2);

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div className="overflow-hidden">
        <div 
          className={`grid md:grid-cols-2 gap-6 mb-8 transition-all duration-500 ease-in-out ${
            isAnimating ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0'
          }`}
        >
        {visibleEvents.map((evento) => (
          <Card
            key={evento.id}
            onClick={() => {
              setSelectedEvento(evento);
              setModalOpen(true);
            }}
            className="relative group overflow-hidden transition-all duration-300 cursor-pointer hover:scale-[1.02]"
            style={{
              backgroundColor: "rgba(30, 41, 59, 0.6)",
              borderColor: "rgba(180, 160, 120, 0.4)",
            }}
          >
            {/* Corner Markers */}
            <div
              className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 z-10"
              style={{ borderColor: "hsl(45, 35%, 75%)" }}
            />
            <div
              className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 z-10"
              style={{ borderColor: "hsl(45, 35%, 75%)" }}
            />
            <div
              className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 z-10"
              style={{ borderColor: "hsl(45, 35%, 75%)" }}
            />
            <div
              className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 z-10"
              style={{ borderColor: "hsl(45, 35%, 75%)" }}
            />

            {/* Background Gradient Effect */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity"
              style={{
                background:
                  "linear-gradient(135deg, rgba(180, 160, 120, 0.1), transparent)",
              }}
            />

            {/* Event Image */}
            <div className="relative w-full h-32 overflow-hidden bg-slate-800">
              <Image
                src={evento.imagem || defaultEventImage}
                alt={evento.titulo}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Image Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

              {/* Categoria Badge on Image */}
              <div className="absolute top-4 left-4 z-10">
                <div
                  className={`inline-block px-3 py-1 border text-xs font-orbitron tracking-wider backdrop-blur-sm ${getCategoriaStyle(evento.categoria)}`}
                >
                  {evento.categoria}
                </div>
              </div>
            </div>

            <CardHeader className="relative pb-2">
              <CardTitle className="text-lg md:text-xl font-orbitron font-bold line-clamp-2 text-white">
                {evento.titulo}
              </CardTitle>
            </CardHeader>

            <CardContent className="relative space-y-3">
              {/* Info */}
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center gap-2 text-gray-200">
                  <Calendar className="w-4 h-4 shrink-0 text-amber-400" />
                  <span className="font-medium">
                    {formatDate(evento.dataInicio)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Clock className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>
                    {formatTime(evento.dataInicio)} -{" "}
                    {formatTime(evento.dataFim)}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-gray-300">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                  <span className="line-clamp-1">
                    {evento.endereco}, {evento.numero} - CEP: {evento.cep}
                  </span>
                </div>
              </div>

              {/* Descrição */}
              {evento.descricao && (
                <CardDescription className="text-sm line-clamp-2 leading-relaxed text-gray-400">
                  {evento.descricao}
                </CardDescription>
              )}
            </CardContent>
          </Card>
        ))}
        </div>
      </div>

      {/* Navigation Controls */}
      {eventos.length > 2 && (
        <div className="flex items-center justify-center">
          {/* Dots Indicator */}
          <div className="flex gap-2.5">
            {Array.from({ length: Math.ceil(eventos.length / 2) }).map(
              (_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsAnimating(true);
                    setTimeout(() => {
                      setCurrentIndex(idx * 2);
                      setIsAnimating(false);
                    }, 300);
                  }}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    Math.floor(currentIndex / 2) === idx
                      ? "bg-amber-400 w-10 shadow-lg shadow-amber-400/50"
                      : "bg-gray-500 w-2.5 hover:bg-gray-400 hover:w-4"
                  }`}
                  aria-label={`Ir para página ${idx + 1}`}
                />
              ),
            )}
          </div>
        </div>
      )}

      {/* Event Counter */}
      <div className="text-center mt-6 text-sm text-muted-foreground font-orbitron tracking-wider">
        {eventos.length} {eventos.length === 1 ? "EVENTO" : "EVENTOS"} PÚBLICO
        {eventos.length !== 1 ? "S" : ""} AGENDADO
        {eventos.length !== 1 ? "S" : ""}
      </div>

      {/* Modal de Visualização */}
      {selectedEvento && (
        <ViewEventoModal
          evento={selectedEvento}
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
      )}
    </div>
  );
}

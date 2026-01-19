"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Eye,
  Calendar,
  User,
  MapPin,
  Globe,
  Lock,
  Clock,
  Users,
  Link as LinkIcon,
  Tag,
  Image as ImageIcon,
  Navigation,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Evento } from "@/contexts/EventosContext";
import { categoriaLabels, categoriaColors } from "@/lib/utils/categorias";
import { formatDateTime, formatDate } from "@/lib/utils/date-format";

interface ViewEventoModalProps {
  evento: Evento;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ViewEventoModal({ evento, trigger, open: controlledOpen, onOpenChange }: ViewEventoModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Eye className="w-4 h-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Calendar className="w-6 h-6 text-sand" />
            {evento.titulo}
          </DialogTitle>
          <DialogDescription>Detalhes completos do evento</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4 overflow-y-auto flex-1">
          {/* Imagem do Evento */}
          {evento.imagem && (
            <div className="w-full relative h-64">
              <Image
                src={evento.imagem}
                alt={evento.titulo}
                fill
                className="object-cover rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Categoria e Visibilidade */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-muted-foreground" />
              <span
                className={`px-3 py-1 text-sm font-medium rounded-md border ${
                  categoriaColors[
                    evento.categoria as keyof typeof categoriaColors
                  ]
                }`}
              >
                {
                  categoriaLabels[
                    evento.categoria as keyof typeof categoriaLabels
                  ]
                }
              </span>
            </div>

            <div className="flex items-center gap-2">
              {evento.visibilidade === "PUBLICA" ? (
                <>
                  <Globe className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">
                    Evento Público
                  </span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-600">
                    Evento Privado
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Descrição */}
          {evento.descricao && (
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Descrição
              </label>
              <div className="bg-muted/50 rounded-lg p-4 text-sm leading-relaxed">
                {evento.descricao}
              </div>
            </div>
          )}

          {/* Datas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 rounded-lg p-4">
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-600" />
                Data de Início
              </label>
              <p className="text-sm text-muted-foreground">
                {formatDateTime(evento.dataInicio)}
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-600" />
                Data de Término
              </label>
              <p className="text-sm text-muted-foreground">
                {formatDateTime(evento.dataFim)}
              </p>
            </div>
          </div>

          {/* Localização */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-3 block flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Localização
            </label>
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-2">
                <Navigation className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">
                    {evento.endereco}, {evento.numero}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    CEP: {evento.cep}
                  </p>
                </div>
              </div>

              {evento.latitude && evento.longitude && (
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Coordenadas: {evento.latitude.toFixed(6)},{" "}
                    {evento.longitude.toFixed(6)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Criador */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block flex items-center gap-2">
              <User className="w-4 h-4" />
              Criado por
            </label>
            <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-4">
              <div className="w-10 h-10 bg-sand/20 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-sand" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {evento.criador.nome} {evento.criador.sobrenome}
                </p>
                <p className="text-xs text-muted-foreground">
                  {evento.criador.email}
                </p>
              </div>
            </div>
          </div>

          {/* Participantes */}
          {evento.participantes && evento.participantes.length > 0 && (
            <div>
              <label className="text-sm font-semibold text-foreground mb-3 block flex items-center gap-2">
                <Users className="w-4 h-4" />
                Participantes ({evento.participantes.length})
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {evento.participantes.map((participante) => (
                  <div
                    key={participante.id}
                    className="flex items-center gap-3 bg-muted/50 rounded-lg p-3"
                  >
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {participante.user.nome} {participante.user.sobrenome}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {participante.user.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Link do YouTube */}
          {evento.linkYoutube && (
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                Link do YouTube
              </label>
              <a
                href={evento.linkYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-red-500/10 text-red-600 hover:bg-red-500/20 rounded-lg p-3 transition-colors"
              >
                <LinkIcon className="w-4 h-4" />
                <span className="text-sm font-medium truncate">
                  {evento.linkYoutube}
                </span>
              </a>
            </div>
          )}

          {/* Metadados */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Criado em
              </label>
              <p className="text-sm">{formatDate(evento.createdAt)}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Última atualização
              </label>
              <p className="text-sm">{formatDate(evento.updatedAt)}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-border flex-shrink-0">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

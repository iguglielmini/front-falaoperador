"use client";

import {
  Eye,
  Building2,
  Mail,
  Phone,
  MapPin,
  Link as LinkIcon,
  ExternalLink,
} from "lucide-react";
import { Patrocinador } from "@/contexts/PatrocinadoresContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ViewPatrocinadorModalProps {
  patrocinador: Patrocinador | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ViewPatrocinadorModal({
  patrocinador,
  open,
  onOpenChange,
}: ViewPatrocinadorModalProps) {
  if (!patrocinador) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col p-0">
        <div className="sticky top-0 z-10 bg-background border-b px-6 py-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Detalhes do Patrocinador
            </DialogTitle>
            <DialogDescription>
              Informações completas do patrocinador
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Imagem */}
          {patrocinador.imagem && (
            <div className="relative w-full h-64 rounded-lg overflow-hidden border bg-muted">
              <Image
                src={patrocinador.imagem}
                alt={patrocinador.nomeEmpresa}
                fill
                className="object-contain"
              />
            </div>
          )}

          {/* Nome da Empresa */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-5 h-5 text-sand" />
              <h3 className="text-lg font-semibold">Nome da Empresa</h3>
            </div>
            <p className="text-muted-foreground pl-7">
              {patrocinador.nomeEmpresa}
            </p>
          </div>

          <Separator />

          {/* Links */}
          {patrocinador.links && patrocinador.links.length > 0 && (
            <>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <LinkIcon className="w-5 h-5 text-sand" />
                  <h3 className="text-lg font-semibold">Links</h3>
                </div>
                <div className="pl-7 space-y-2">
                  {patrocinador.links.map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                    >
                      <ExternalLink className="w-4 h-4 shrink-0" />
                      <span className="truncate group-hover:underline">
                        {link}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Contato */}
          {(patrocinador.email || patrocinador.telefone) && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Informações de Contato
                </h3>
                <div className="space-y-3">
                  {patrocinador.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-sand mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Email
                        </p>
                        <a
                          href={`mailto:${patrocinador.email}`}
                          className="text-sm hover:underline"
                        >
                          {patrocinador.email}
                        </a>
                      </div>
                    </div>
                  )}
                  {patrocinador.telefone && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-sand mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Telefone
                        </p>
                        <a
                          href={`tel:${patrocinador.telefone}`}
                          className="text-sm hover:underline"
                        >
                          {patrocinador.telefone}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Endereço */}
          {patrocinador.endereco && (
            <>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-sand" />
                  <h3 className="text-lg font-semibold">Endereço</h3>
                </div>
                <p className="text-muted-foreground pl-7">
                  {patrocinador.endereco}
                </p>
              </div>
              <Separator />
            </>
          )}

          {/* Metadados */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Metadados</h3>
            <div className="grid grid-cols-2 gap-4 pl-1">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Data de Criação
                </p>
                <Badge variant="outline" className="text-xs">
                  {formatDate(patrocinador.createdAt)}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Última Atualização
                </p>
                <Badge variant="outline" className="text-xs">
                  {formatDate(patrocinador.updatedAt)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 z-10 bg-background border-t px-6 py-4 flex justify-end">
          <Button onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

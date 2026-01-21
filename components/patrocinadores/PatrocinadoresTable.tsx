/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import {
  Trash2,
  Eye,
  Pencil,
  ChevronLeft,
  ChevronRight,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Patrocinador } from "@/contexts/PatrocinadoresContext";
import Image from "next/image";

interface PatrocinadoresTableProps {
  patrocinadores: Patrocinador[];
  onDelete: (patrocinador: Patrocinador) => void;
  onEdit: (patrocinador: Patrocinador) => void;
  onView: (patrocinador: Patrocinador) => void;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function PatrocinadoresTable({
  patrocinadores,
  onDelete,
  onEdit,
  onView,
}: PatrocinadoresTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [patrocinadorToDelete, setPatrocinadorToDelete] = useState<Patrocinador | null>(null);
  const itemsPerPage = 10;

  // Calcular paginação
  const totalPages = Math.ceil(patrocinadores.length / itemsPerPage);
  const effectiveCurrentPage =
    currentPage > totalPages && totalPages > 0 ? 1 : currentPage;
  const startIndex = (effectiveCurrentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPatrocinadores = patrocinadores.slice(startIndex, endIndex);

  // Resetar para página 1 quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [patrocinadores.length]);

  const handleDeleteClick = (patrocinador: Patrocinador) => {
    setPatrocinadorToDelete(patrocinador);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (patrocinadorToDelete) {
      onDelete(patrocinadorToDelete);
      setDeleteModalOpen(false);
      setPatrocinadorToDelete(null);
    }
  };

  if (patrocinadores.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed rounded-lg">
        <Building2 className="w-16 h-16 mb-4 text-muted-foreground/50" />
        <h3 className="text-lg font-semibold mb-2">Nenhum patrocinador encontrado</h3>
        <p className="text-sm text-muted-foreground">
          Comece adicionando um novo patrocinador
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-card border border-border rounded-lg overflow-hidden animate-fade-in-up">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground w-[80px]">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Empresa
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Contato
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Endereço
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                  Data
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {currentPatrocinadores.map((patrocinador, index) => {
                const sequentialId = startIndex + index + 1;
                const delay = Math.min(index * 50, 500);

                return (
                  <tr
                    key={patrocinador.id}
                    className={`hover:bg-muted/30 transition-colors animate-fade-in-left${delay > 0 ? ` animate-delay-${delay}` : ''}`}
                  >
                    <td className="px-6 py-4 font-medium text-muted-foreground">
                      #{sequentialId.toString().padStart(3, "0")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted">
                          {patrocinador.imagem ? (
                            <Image
                              src={patrocinador.imagem}
                              alt={patrocinador.nomeEmpresa}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-sand/20">
                              <Building2 className="w-5 h-5 text-sand" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">{patrocinador.nomeEmpresa}</span>
                          {patrocinador.links && patrocinador.links.length > 0 && (
                            <span className="text-xs text-muted-foreground">
                              {patrocinador.links.length} link{patrocinador.links.length > 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                        {patrocinador.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span className="truncate max-w-[200px]">{patrocinador.email}</span>
                          </div>
                        )}
                        {patrocinador.telefone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>{patrocinador.telefone}</span>
                          </div>
                        )}
                        {!patrocinador.email && !patrocinador.telefone && (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {patrocinador.endereco ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span className="line-clamp-2 max-w-[250px]">{patrocinador.endereco}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatDate(patrocinador.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onView(patrocinador)}
                          className="h-8 w-8"
                          title="Visualizar"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(patrocinador)}
                          className="h-8 w-8"
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(patrocinador)}
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                          title="Deletar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 animate-fade-in">
          <p className="text-sm text-muted-foreground">
            Mostrando {startIndex + 1} a{" "}
            {Math.min(endIndex, patrocinadores.length)} de{" "}
            {patrocinadores.length} patrocinadores
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={effectiveCurrentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={
                      page === effectiveCurrentPage ? "default" : "outline"
                    }
                    size="icon"
                    onClick={() => setCurrentPage(page)}
                    className="h-9 w-9"
                  >
                    {page}
                  </Button>
                )
              )}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={effectiveCurrentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Deleção */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o patrocinador{" "}
              <strong>{patrocinadorToDelete?.nomeEmpresa}</strong>? Esta ação
              não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

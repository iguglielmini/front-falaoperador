/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  User,
  Trash2,
  Eye,
  Pencil,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Globe,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Evento } from "@/contexts/EventosContext";

interface EventosTableProps {
  eventos: Evento[];
  onDelete: (evento: Evento) => void;
  onEdit: (evento: Evento) => void;
  onView: (evento: Evento) => void;
}

const categoriaLabels = {
  PODCAST: "Podcast",
  EVENTO: "Evento",
  ENTREVISTA: "Entrevista",
  LIVE: "Live",
  OUTRO: "Outro",
};

const categoriaColors = {
  PODCAST: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  EVENTO: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  ENTREVISTA: "bg-green-500/10 text-green-600 border-green-500/20",
  LIVE: "bg-red-500/10 text-red-600 border-red-500/20",
  OUTRO: "bg-gray-500/10 text-gray-600 border-gray-500/20",
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function EventosTable({
  eventos,
  onDelete,
  onEdit,
  onView,
}: EventosTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventoToDelete, setEventoToDelete] = useState<Evento | null>(null);
  const itemsPerPage = 10;

  // Calcular paginação
  const totalPages = Math.ceil(eventos.length / itemsPerPage);
  const effectiveCurrentPage =
    currentPage > totalPages && totalPages > 0 ? 1 : currentPage;
  const startIndex = (effectiveCurrentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEventos = eventos.slice(startIndex, endIndex);

  // Resetar para página 1 quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [eventos.length]);

  // Ajustar página se ficar vazia após exclusão
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleDeleteClick = (evento: Evento) => {
    setEventoToDelete(evento);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (eventoToDelete) {
      onDelete(eventoToDelete);
      setDeleteModalOpen(false);
      setEventoToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setEventoToDelete(null);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  if (eventos.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">
          Nenhum evento cadastrado
        </h3>
        <p className="text-muted-foreground">
          Comece criando seu primeiro evento
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Criador</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Data Início</TableHead>
              <TableHead>Data Fim</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentEventos.map((evento, index) => {
              const sequentialId = startIndex + index + 1;

              return (
                <TableRow key={evento.id}>
                  <TableCell className="font-medium text-muted-foreground">
                    #{sequentialId.toString().padStart(3, "0")}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{evento.titulo}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground truncate">
                            {evento.endereco}, {evento.numero}
                          </p>
                        </div>
                      </div>
                      {evento.visibilidade === "PUBLICA" ? (
                        <Globe className="w-4 h-4 text-green-600 shrink-0" />
                      ) : (
                        <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {evento.criador.nome} {evento.criador.sobrenome}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-md border ${
                        categoriaColors[evento.categoria as keyof typeof categoriaColors]
                      }`}
                    >
                      {categoriaLabels[evento.categoria as keyof typeof categoriaLabels]}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {formatDateTime(evento.dataInicio)}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {formatDateTime(evento.dataFim)}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(evento)}
                        title="Visualizar"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(evento)}
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(evento)}
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <p className="text-sm text-muted-foreground">
              Mostrando {startIndex + 1} a{" "}
              {Math.min(endIndex, eventos.length)} de {eventos.length} eventos
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={effectiveCurrentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </Button>
              <span className="text-sm">
                Página {effectiveCurrentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={effectiveCurrentPage === totalPages}
              >
                Próxima
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o evento{" "}
              <strong>{eventoToDelete?.titulo}</strong>?<br />
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelDelete}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

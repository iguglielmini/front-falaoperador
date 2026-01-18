/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import * as React from "react";
import {
  Calendar,
  User,
  AlertCircle,
  Trash2,
  Globe,
  Lock,
  ChevronLeft,
  ChevronRight,
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
import { EditTarefaModal } from "./EditTarefaModal";
import { ViewTarefaModal } from "./ViewTarefaModal";
import { Tarefa } from "@/contexts/TarefasContext";
import {
  statusColors,
  statusLabels,
  prioridadeColors,
  prioridadeLabels,
  formatDate,
} from "@/lib/utils/tarefa-helpers";

interface TarefasTableProps {
  tarefas: Tarefa[];
  onDelete: (tarefa: Tarefa) => void;
}

export function TarefasTable({ tarefas, onDelete }: TarefasTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calcular paginação
  const totalPages = Math.ceil(tarefas.length / itemsPerPage);
  const effectiveCurrentPage =
    currentPage > totalPages && totalPages > 0 ? 1 : currentPage;
  const startIndex = (effectiveCurrentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTarefas = tarefas.slice(startIndex, endIndex);

  // Reset para página 1 quando tarefas mudam e página atual excede total
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [tarefas.length, currentPage, totalPages]);

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">#</TableHead>
            <TableHead className="w-[40%]">Tarefa</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead>Responsável</TableHead>
            <TableHead>Prazo</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentTarefas.map((tarefa, index) => (
            <TableRow key={tarefa.id}>
              <TableCell className="font-medium text-muted-foreground">
                {startIndex + index + 1}
              </TableCell>
              <TableCell>
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">
                        {tarefa.titulo}
                      </span>
                      {tarefa.publica ? (
                        <Globe className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      )}
                    </div>
                    {tarefa.descricao && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {tarefa.descricao}
                      </p>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    statusColors[tarefa.status as keyof typeof statusColors]
                  }`}
                >
                  {statusLabels[tarefa.status as keyof typeof statusLabels]}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    prioridadeColors[
                      tarefa.prioridade as keyof typeof prioridadeColors
                    ]
                  }`}
                >
                  <AlertCircle className="w-3 h-3" />
                  {
                    prioridadeLabels[
                      tarefa.prioridade as keyof typeof prioridadeLabels
                    ]
                  }
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground truncate max-w-37.5">
                    {tarefa.user.nome} {tarefa.user.sobrenome}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {tarefa.dataFim ? (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(tarefa.dataFim)}
                  </div>
                ) : (
                  <span className="text-muted-foreground/50">Sem prazo</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <ViewTarefaModal tarefa={tarefa} />
                  <EditTarefaModal tarefa={tarefa} />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(tarefa)}
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <div className="text-sm text-muted-foreground">
            Mostrando {startIndex + 1} a {Math.min(endIndex, tarefas.length)}{" "}
            de {tarefas.length} tarefas
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Anterior
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  // Mostrar primeira, última e páginas próximas à atual
                  return (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  );
                })
                .map((page, index, array) => {
                  // Adicionar "..." entre páginas não consecutivas
                  const showEllipsis =
                    index > 0 && page - array[index - 1] > 1;
                  return (
                    <React.Fragment key={page}>
                      {showEllipsis && (
                        <span className="px-2 text-muted-foreground">
                          ...
                        </span>
                      )}
                      <Button
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-9 h-9 p-0"
                      >
                        {page}
                      </Button>
                    </React.Fragment>
                  );
                })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
            >
              Próximo
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

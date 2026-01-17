"use client";

import { useState } from "react";
import {
  Eye,
  Calendar,
  User,
  AlertCircle,
  CheckSquare,
  Globe,
  Lock,
  Clock,
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
import { Tarefa } from "@/contexts/TarefasContext";
import {
  statusColors,
  statusLabels,
  prioridadeColors,
  prioridadeLabels,
  formatDate,
  formatDateTime,
} from "@/lib/utils/tarefa-helpers";

interface ViewTarefaModalProps {
  tarefa: Tarefa;
  trigger?: React.ReactNode;
}

export function ViewTarefaModal({ tarefa, trigger }: ViewTarefaModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Eye className="w-4 h-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-sand" />
            {tarefa.titulo}
          </DialogTitle>
          <DialogDescription>Detalhes completos da tarefa</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Status, Data Início e Data Conclusão */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Status
              </label>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  statusColors[tarefa.status as keyof typeof statusColors]
                }`}
              >
                {statusLabels[tarefa.status as keyof typeof statusLabels]}
              </span>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Prioridade
              </label>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                  prioridadeColors[
                    tarefa.prioridade as keyof typeof prioridadeColors
                  ]
                }`}
              >
                <AlertCircle className="w-4 h-4" />
                {
                  prioridadeLabels[
                    tarefa.prioridade as keyof typeof prioridadeLabels
                  ]
                }
              </span>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Data de Início
              </label>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>
                  {tarefa.dataInicio
                    ? formatDate(tarefa.dataInicio)
                    : "Não definida"}
                </span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Data de Conclusão
              </label>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>
                  {tarefa.dataFim ? formatDate(tarefa.dataFim) : "Não definida"}
                </span>
              </div>
            </div>
          </div>

          {/* Descrição */}
          {tarefa.descricao && (
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Descrição
              </label>
              <div className="bg-muted/50 rounded-lg p-4 text-sm leading-relaxed">
                {tarefa.descricao}
              </div>
            </div>
          )}

          {/* Visibilidade */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Visibilidade
            </label>
            <div className="flex items-center gap-2">
              {tarefa.publica ? (
                <>
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    Tarefa pública (visível para todos)
                  </span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Tarefa privada (apenas você)</span>
                </>
              )}
            </div>
          </div>

          {/* Responsável */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Responsável
            </label>
            <div className="flex items-center gap-3 bg-muted/30 rounded-lg p-3">
              <div className="w-10 h-10 rounded-full bg-sand/20 flex items-center justify-center">
                <User className="w-5 h-5 text-sand" />
              </div>
              <div>
                <p className="font-medium">
                  {tarefa.user.nome} {tarefa.user.sobrenome}
                </p>
                <p className="text-sm text-muted-foreground">
                  {tarefa.user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Metadados */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Criado em
              </label>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{formatDateTime(tarefa.createdAt)}</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Atualizado em
              </label>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{formatDateTime(tarefa.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

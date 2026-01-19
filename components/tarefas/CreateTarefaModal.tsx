"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTarefas } from "@/contexts/TarefasContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusTarefa, PrioridadeTarefa } from "@prisma/client";

interface CreateTarefaModalProps {
  trigger?: React.ReactNode;
}

interface TarefaPayload {
  titulo: string;
  status: StatusTarefa;
  prioridade: PrioridadeTarefa;
  publica: boolean;
  descricao?: string;
  dataInicio?: string;
  dataFim?: string;
  userId?: string;
}

export function CreateTarefaModal({ trigger }: CreateTarefaModalProps) {
  const { createTarefa } = useTarefas();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    status: StatusTarefa.PENDENTE,
    prioridade: PrioridadeTarefa.MEDIA,
    publica: false,
    dataInicio: "",
    dataFim: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Preparar dados para envio
      const dataToSend: TarefaPayload = {
        titulo: formData.titulo,
        status: formData.status,
        prioridade: formData.prioridade,
        publica: formData.publica,
      };

      // Adicionar descrição se preenchida
      if (formData.descricao.trim()) {
        dataToSend.descricao = formData.descricao;
      }

      // Adicionar datas se preenchidas
      if (formData.dataInicio) {
        dataToSend.dataInicio = formData.dataInicio;
      }
      if (formData.dataFim) {
        dataToSend.dataFim = formData.dataFim;
      }

      // Chamar createTarefa do contexto (ele já faz a chamada à API e atualiza o estado)
      const novaTarefa = await createTarefa(dataToSend);

      if (!novaTarefa) {
        setError("Erro ao criar tarefa");
        return;
      }

      // Sucesso
      setOpen(false);
      setFormData({
        titulo: "",
        descricao: "",
        status: StatusTarefa.PENDENTE,
        prioridade: PrioridadeTarefa.MEDIA,
        publica: false,
        dataInicio: "",
        dataFim: "",
      });
    } catch (err) {
      setError("Erro ao conectar com o servidor");
      console.error("Erro ao criar tarefa:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Nova Tarefa
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-137.5 max-h-[90vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle>Nova Tarefa</DialogTitle>
          <DialogDescription>
            Preencha os dados para criar uma nova tarefa.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="grid gap-4 py-4 overflow-y-auto flex-1">
            {/* Título */}
            <div className="grid gap-2">
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => handleChange("titulo", e.target.value)}
                placeholder="Digite o título da tarefa"
                required
                minLength={3}
                maxLength={100}
              />
              <span className="text-xs text-muted-foreground">
                Mínimo 3 caracteres, máximo 100
              </span>
            </div>

            {/* Descrição */}
            <div className="grid gap-2">
              <Label htmlFor="descricao">Descrição</Label>
              <textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => handleChange("descricao", e.target.value)}
                placeholder="Descreva os detalhes da tarefa (opcional)"
                maxLength={500}
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
              <span className="text-xs text-muted-foreground">
                Máximo 500 caracteres ({formData.descricao.length}/500)
              </span>
            </div>

            {/* Status e Prioridade */}
            <div className="grid grid-cols-2 gap-4">
              {/* Status */}
              <div className="grid gap-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={StatusTarefa.PENDENTE}>
                      Pendente
                    </SelectItem>
                    <SelectItem value={StatusTarefa.EM_PROGRESSO}>
                      Em Progresso
                    </SelectItem>
                    <SelectItem value={StatusTarefa.CONCLUIDA}>
                      Concluída
                    </SelectItem>
                    <SelectItem value={StatusTarefa.CANCELADA}>
                      Cancelada
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Prioridade */}
              <div className="grid gap-2">
                <Label htmlFor="prioridade">Prioridade *</Label>
                <Select
                  value={formData.prioridade}
                  onValueChange={(value) => handleChange("prioridade", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PrioridadeTarefa.BAIXA}>
                      Baixa
                    </SelectItem>
                    <SelectItem value={PrioridadeTarefa.MEDIA}>
                      Média
                    </SelectItem>
                    <SelectItem value={PrioridadeTarefa.ALTA}>
                      Alta
                    </SelectItem>
                    <SelectItem value={PrioridadeTarefa.URGENTE}>
                      Urgente
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Datas */}
            <div className="grid grid-cols-2 gap-4">
              {/* Data Início */}
              <div className="grid gap-2">
                <Label htmlFor="dataInicio">Data de Início</Label>
                <Input
                  id="dataInicio"
                  type="date"
                  value={formData.dataInicio}
                  onChange={(e) => handleChange("dataInicio", e.target.value)}
                />
              </div>

              {/* Data Fim */}
              <div className="grid gap-2">
                <Label htmlFor="dataFim">Data de Conclusão</Label>
                <Input
                  id="dataFim"
                  type="date"
                  value={formData.dataFim}
                  onChange={(e) => handleChange("dataFim", e.target.value)}
                  min={formData.dataInicio || undefined}
                />
              </div>
            </div>

            {/* Pública */}
            <div className="flex items-center gap-2">
              <input
                id="publica"
                type="checkbox"
                checked={formData.publica}
                onChange={(e) => handleChange("publica", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="publica" className="cursor-pointer font-normal">
                Tarefa pública (visível para todos os usuários)
              </Label>
            </div>

            {/* Erro */}
            {error && (
              <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 p-3 rounded-md">
                {error}
              </div>
            )}
          </div>

          <DialogFooter className="flex-shrink-0 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Criando..." : "Criar Tarefa"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

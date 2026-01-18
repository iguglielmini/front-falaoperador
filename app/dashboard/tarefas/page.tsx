"use client";

import { useEffect } from "react";
import { CheckSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateTarefaModal } from "@/components/tarefas/CreateTarefaModal";
import { TarefasTable } from "@/components/tarefas/TarefasTable";
import { useTarefas } from "@/contexts/TarefasContext";

export default function TarefasPage() {
  const { tarefas, loading, fetchTarefas, deleteTarefa } = useTarefas();

  useEffect(() => {
    fetchTarefas();
  }, [fetchTarefas]);

  const handleDelete = async (tarefa: (typeof tarefas)[number]) => {
    if (!confirm(`Deseja realmente excluir a tarefa "${tarefa.titulo}"?`)) {
      return;
    }

    await deleteTarefa(tarefa.id);
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <CheckSquare className="w-8 h-8 text-sand" />
            <h1 className="text-3xl font-orbitron font-bold">Tarefas</h1>
          </div>
          <CreateTarefaModal />
        </div>
        <p className="text-muted-foreground">
          Organize e acompanhe suas tarefas
        </p>
      </div>

      {/* Tarefas List */}
      {loading ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <div className="text-muted-foreground">Carregando tarefas...</div>
        </div>
      ) : tarefas.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <CheckSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            Nenhuma tarefa cadastrada
          </h3>
          <p className="text-muted-foreground mb-6">
            Comece adicionando sua primeira tarefa
          </p>
          <CreateTarefaModal
            trigger={
              <Button variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                Criar Tarefa
              </Button>
            }
          />
        </div>
      ) : (
        <TarefasTable tarefas={tarefas} onDelete={handleDelete} />
      )}
    </div>
  );
}

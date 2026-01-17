"use client";

import { useEffect } from "react";
import {
  CheckSquare,
  Plus,
  Calendar,
  User,
  AlertCircle,
  Pencil,
  Trash2,
  Globe,
  Lock,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CreateTarefaModal } from "@/components/tarefas/CreateTarefaModal";
import { EditTarefaModal } from "@/components/tarefas/EditTarefaModal";
import { ViewTarefaModal } from "@/components/tarefas/ViewTarefaModal";
import { useTarefas } from "@/contexts/TarefasContext";
import {
  statusColors,
  statusLabels,
  prioridadeColors,
  prioridadeLabels,
  formatDate,
} from "@/lib/utils/tarefa-helpers";

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
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    Tarefa
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    Prioridade
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    Responsável
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    Prazo
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tarefas.map((tarefa) => (
                  <tr
                    key={tarefa.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-sand/20 flex items-center justify-center shrink-0">
                          <CheckSquare className="w-5 h-5 text-sand" />
                        </div>
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
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusColors[
                            tarefa.status as keyof typeof statusColors
                          ]
                        }`}
                      >
                        {
                          statusLabels[
                            tarefa.status as keyof typeof statusLabels
                          ]
                        }
                      </span>
                    </td>
                    <td className="px-6 py-4">
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
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground truncate max-w-37.5">
                          {tarefa.user.nome} {tarefa.user.sobrenome}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {tarefa.dataFim ? (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {formatDate(tarefa.dataFim)}
                        </div>
                      ) : (
                        <span className="text-muted-foreground/50">
                          Sem prazo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <ViewTarefaModal tarefa={tarefa} />
                        <EditTarefaModal tarefa={tarefa} />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(tarefa)}
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

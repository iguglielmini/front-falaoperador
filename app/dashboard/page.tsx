"use client";

import { useEffect, useState } from "react";
import { Users, Calendar, CheckSquare, Clock, TrendingUp } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useTarefas } from "@/contexts/TarefasContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  statusColors,
  statusLabels,
  prioridadeColors,
  prioridadeLabels,
  formatDate,
} from "@/lib/utils/tarefa-helpers";

interface DashboardStats {
  totalUsuarios: number;
  totalTarefas: number;
  tarefasPendentes: number;
  tarefasEmProgresso: number;
  tarefasConcluidas: number;
}

export default function DashboardPage() {
  const { user } = useUser();
  const { tarefas, loading, fetchTarefas } = useTarefas();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsuarios: 0,
    totalTarefas: 0,
    tarefasPendentes: 0,
    tarefasEmProgresso: 0,
    tarefasConcluidas: 0,
  });

  useEffect(() => {
    fetchTarefas();
  }, [fetchTarefas]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/users");
        if (response.ok) {
          const result = await response.json();
          const usuarios = result.data || [];

          setStats({
            totalUsuarios: usuarios.length,
            totalTarefas: tarefas.length,
            tarefasPendentes: tarefas.filter((t) => t.status === "PENDENTE")
              .length,
            tarefasEmProgresso: tarefas.filter(
              (t) => t.status === "EM_PROGRESSO"
            ).length,
            tarefasConcluidas: tarefas.filter((t) => t.status === "CONCLUIDA")
              .length,
          });
        }
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
      }
    };

    if (!loading) {
      fetchStats();
    }
  }, [tarefas, loading]);

  // Tarefas recentes (últimas 5)
  const tarefasRecentes = tarefas.slice(0, 5);

  // Minhas tarefas pendentes
  const minhasTarefasPendentes = tarefas.filter(
    (t) => t.userId === user?.id && t.status === "PENDENTE"
  );

  // Taxa de conclusão
  const taxaConclusao =
    stats.totalTarefas > 0
      ? Math.round((stats.tarefasConcluidas / stats.totalTarefas) * 100)
      : 0;

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-orbitron font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo(a), {user?.nome}! Aqui está um resumo do sistema.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Total Tarefas
            </span>
            <CheckSquare className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold mb-1">{stats.totalTarefas}</p>
          <p className="text-xs text-muted-foreground">
            {stats.tarefasPendentes} pendentes
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Em Progresso
            </span>
            <Clock className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold mb-1">{stats.tarefasEmProgresso}</p>
          <p className="text-xs text-muted-foreground">Tarefas ativas</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Concluídas
            </span>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold mb-1">{stats.tarefasConcluidas}</p>
          <p className="text-xs text-muted-foreground">Taxa: {taxaConclusao}%</p>
        </Card>

        {user?.perfil === "ADMIN" && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Total Usuários
              </span>
              <Users className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold mb-1">{stats.totalUsuarios}</p>
            <p className="text-xs text-muted-foreground">Cadastrados</p>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Minhas Tarefas Pendentes */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Minhas Tarefas Pendentes</h2>
            <Link href="/dashboard/tarefas">
              <Button variant="ghost" size="sm">
                Ver todas
              </Button>
            </Link>
          </div>

          {minhasTarefasPendentes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Nenhuma tarefa pendente</p>
            </div>
          ) : (
            <div className="space-y-3">
              {minhasTarefasPendentes.slice(0, 4).map((tarefa) => (
                <div
                  key={tarefa.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{tarefa.titulo}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          prioridadeColors[
                            tarefa.prioridade as keyof typeof prioridadeColors
                          ]
                        }`}
                      >
                        {
                          prioridadeLabels[
                            tarefa.prioridade as keyof typeof prioridadeLabels
                          ]
                        }
                      </span>
                      {tarefa.dataFim && (
                        <span className="text-xs text-muted-foreground">
                          Prazo: {formatDate(tarefa.dataFim)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Atividades Recentes */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Atividades Recentes</h2>
            <Link href="/dashboard/tarefas">
              <Button variant="ghost" size="sm">
                Ver todas
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando...
            </div>
          ) : tarefasRecentes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Nenhuma atividade recente</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tarefasRecentes.map((tarefa) => (
                <div
                  key={tarefa.id}
                  className="flex items-start gap-3 p-3 border border-border rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
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
                    </div>
                    <p className="font-medium text-sm truncate">
                      {tarefa.titulo}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {tarefa.user.nome} {tarefa.user.sobrenome}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/dashboard/tarefas">
            <Button variant="outline" className="w-full h-20 flex-col gap-2">
              <CheckSquare className="w-6 h-6" />
              <span>Gerenciar Tarefas</span>
            </Button>
          </Link>

          {user?.perfil === "ADMIN" && (
            <Link href="/dashboard/usuarios">
              <Button variant="outline" className="w-full h-20 flex-col gap-2">
                <Users className="w-6 h-6" />
                <span>Gerenciar Usuários</span>
              </Button>
            </Link>
          )}

          <Link href="/dashboard/configuracao">
            <Button variant="outline" className="w-full h-20 flex-col gap-2">
              <Users className="w-6 h-6" />
              <span>Meu Perfil</span>
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

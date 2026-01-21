"use client";

import { useEffect, useState } from "react";
import { Users, Calendar, CheckSquare, TrendingUp, MapPin } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useTarefas } from "@/contexts/TarefasContext";
import { useEventos } from "@/contexts/EventosContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  statusColors,
  statusLabels,
  prioridadeColors,
  prioridadeLabels,
} from "@/lib/utils/tarefa-helpers";
import { categoriaLabels, categoriaColors } from "@/lib/utils/categorias";
import { formatDateTime, formatDate } from "@/lib/utils/date-format";

interface DashboardStats {
  totalUsuarios: number;
  totalTarefas: number;
  totalEventos: number;
  percentualTarefasFinalizadas: number;
}

export default function DashboardPage() {
  const { user } = useUser();
  const { tarefas, loading: loadingTarefas, fetchTarefas } = useTarefas();
  const { eventos, loading: loadingEventos, fetchEventos } = useEventos();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsuarios: 0,
    totalTarefas: 0,
    totalEventos: 0,
    percentualTarefasFinalizadas: 0,
  });

  useEffect(() => {
    fetchTarefas();
    fetchEventos();
  }, [fetchTarefas, fetchEventos]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/users");
        if (response.ok) {
          const result = await response.json();
          const usuarios = result.data || [];

          const tarefasConcluidas = tarefas.filter(
            (t) => t.status === "CONCLUIDA"
          ).length;
          const percentualFinalizadas =
            tarefas.length > 0
              ? Math.round((tarefasConcluidas / tarefas.length) * 100)
              : 0;

          setStats({
            totalUsuarios: usuarios.length,
            totalTarefas: tarefas.length,
            totalEventos: eventos.length,
            percentualTarefasFinalizadas: percentualFinalizadas,
          });
        }
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
      }
    };

    if (!loadingTarefas && !loadingEventos) {
      fetchStats();
    }
  }, [tarefas, eventos, loadingTarefas, loadingEventos]);

  // Próximos 5 eventos (ordenados por data de início)
  const proximosEventos = eventos
    .filter((e) => new Date(e.dataInicio) >= new Date())
    .sort(
      (a, b) =>
        new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime()
    )
    .slice(0, 5);

  // Tarefas em progresso ou pendentes
  const tarefasAtivas = tarefas
    .filter((t) => t.status === "PENDENTE" || t.status === "EM_PROGRESSO")
    .slice(0, 5);

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 animate-fade-in-down">
        <h1 className="text-3xl font-orbitron font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo(a), {user?.nome}! Aqui está um resumo do sistema.
        </p>
      </div>

      {/* Section 1: Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Total de Usuários
            </span>
            <Users className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold mb-1">{stats.totalUsuarios}</p>
          <p className="text-xs text-muted-foreground">Cadastrados no sistema</p>
        </Card>

        <Card className="p-6 animate-fade-in-up animate-delay-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Total de Eventos
            </span>
            <Calendar className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold mb-1">{stats.totalEventos}</p>
          <p className="text-xs text-muted-foreground">
            {proximosEventos.length} próximos
          </p>
        </Card>

        <Card className="p-6 animate-fade-in-up animate-delay-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Total de Tarefas
            </span>
            <CheckSquare className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold mb-1">{stats.totalTarefas}</p>
          <p className="text-xs text-muted-foreground">
            {tarefasAtivas.length} ativas
          </p>
        </Card>

        <Card className="p-6 animate-fade-in-up animate-delay-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Taxa de Conclusão
            </span>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold mb-1">
            {stats.percentualTarefasFinalizadas}%
          </p>
          <p className="text-xs text-muted-foreground">Tarefas finalizadas</p>
        </Card>
      </div>

      {/* Section 2: Próximos Eventos */}
      <Card className="p-6 mb-8 animate-fade-in-up animate-delay-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-sand" />
            Próximos Eventos
          </h2>
          <Link href="/dashboard/eventos">
            <Button variant="ghost" size="sm">
              Ver todos
            </Button>
          </Link>
        </div>

        {loadingEventos ? (
          <div className="text-center py-8 text-muted-foreground">
            Carregando eventos...
          </div>
        ) : proximosEventos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Nenhum evento próximo</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Título
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Categoria
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Local
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Data
                  </th>
                </tr>
              </thead>
              <tbody>
                {proximosEventos.map((evento) => (
                  <tr
                    key={evento.id}
                    className="border-b border-border hover:bg-accent/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <p className="font-medium">{evento.titulo}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
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
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate max-w-50">
                          {evento.endereco}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm">{formatDate(evento.dataInicio)}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Section 3: Tarefas Ativas (Em Progresso ou Pendente) */}
      <Card className="p-6 animate-fade-in-up animate-delay-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-sand" />
            Tarefas Ativas (Pendente / Em Progresso)
          </h2>
          <Link href="/dashboard/tarefas">
            <Button variant="ghost" size="sm">
              Ver todas
            </Button>
          </Link>
        </div>

        {loadingTarefas ? (
          <div className="text-center py-8 text-muted-foreground">
            Carregando tarefas...
          </div>
        ) : tarefasAtivas.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Nenhuma tarefa ativa</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Título
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Prioridade
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Responsável
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Prazo
                  </th>
                </tr>
              </thead>
              <tbody>
                {tarefasAtivas.map((tarefa) => (
                  <tr
                    key={tarefa.id}
                    className="border-b border-border hover:bg-accent/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <p className="font-medium">{tarefa.titulo}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
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
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
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
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm">
                        {tarefa.user.nome} {tarefa.user.sobrenome}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm">
                        {tarefa.dataFim
                          ? formatDate(tarefa.dataFim)
                          : "Sem prazo"}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

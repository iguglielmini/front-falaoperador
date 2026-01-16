import { TacticalCard } from "@/components/shared/TaticalCard";
import { Users, Calendar, CheckSquare, BarChart3 } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-orbitron font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do sistema Fala Operador
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Total Usuários</span>
            <Users className="w-4 h-4 text-sand" />
          </div>
          <p className="text-2xl font-bold">0</p>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Eventos</span>
            <Calendar className="w-4 h-4 text-sand" />
          </div>
          <p className="text-2xl font-bold">0</p>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Tarefas</span>
            <CheckSquare className="w-4 h-4 text-sand" />
          </div>
          <p className="text-2xl font-bold">0</p>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Atividade</span>
            <BarChart3 className="w-4 h-4 text-sand" />
          </div>
          <p className="text-2xl font-bold">0%</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       
      </div>
    </div>
  );
}

import { Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EventosPage() {
  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-sand" />
            <h1 className="text-3xl font-orbitron font-bold">Eventos</h1>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Evento
          </Button>
        </div>
        <p className="text-muted-foreground">
          Gerenciar eventos do podcast
        </p>
      </div>

      {/* Empty State */}
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Nenhum evento cadastrado</h3>
        <p className="text-muted-foreground mb-6">
          Comece criando seu primeiro evento
        </p>
        <Button variant="outline" className="gap-2">
          <Plus className="w-4 h-4" />
          Criar Evento
        </Button>
      </div>
    </div>
  );
}

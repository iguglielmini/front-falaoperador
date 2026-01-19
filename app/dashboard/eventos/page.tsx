"use client";

import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { useEventos, Evento } from "@/contexts/EventosContext";
import { EventosTable } from "@/components/eventos/EventosTable";
import { CreateEventoModal } from "@/components/eventos/CreateEventoModal";
import { ViewEventoModal } from "@/components/eventos/ViewEventoModal";

export default function EventosPage() {
  const { eventos, loading, fetchEventos, deleteEvento } = useEventos();
  const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  useEffect(() => {
    fetchEventos();
  }, [fetchEventos]);

  const handleDelete = async (evento: { id: string }) => {
    await deleteEvento(evento.id);
  };

  const handleEdit = (evento: any) => {
    // TODO: Abrir modal de edição
    console.log("Editar evento:", evento);
  };

  const handleView = (evento: Evento) => {
    setSelectedEvento(evento);
    setViewModalOpen(true);
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-sand" />
            <h1 className="text-3xl font-orbitron font-bold">Eventos</h1>
          </div>
          <CreateEventoModal />
        </div>
        <p className="text-muted-foreground">
          Gerenciar eventos do podcast
        </p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-sand border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando eventos...</p>
        </div>
      ) : (
        <EventosTable
          eventos={eventos}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onView={handleView}
        />
      )}

      {/* View Modal */}
      {selectedEvento && (
        <ViewEventoModal
          evento={selectedEvento}
          open={viewModalOpen}
          onOpenChange={setViewModalOpen}
        />
      )}
    </div>
  );
}

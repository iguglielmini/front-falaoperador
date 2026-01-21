"use client";

import { useEffect, useState } from "react";
import { Building2 } from "lucide-react";
import {
  usePatrocinadores,
  Patrocinador,
} from "@/contexts/PatrocinadoresContext";
import { PatrocinadoresTable } from "@/components/patrocinadores/PatrocinadoresTable";
import { CreatePatrocinadorModal } from "@/components/patrocinadores/CreatePatrocinadorModal";
import { ViewPatrocinadorModal } from "@/components/patrocinadores/ViewPatrocinadorModal";
import { EditPatrocinadorModal } from "@/components/patrocinadores/EditPatrocinadorModal";

export default function PatrocinadoresPage() {
  const { patrocinadores, loading, fetchPatrocinadores, deletePatrocinador } =
    usePatrocinadores();
  const [selectedPatrocinador, setSelectedPatrocinador] =
    useState<Patrocinador | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    fetchPatrocinadores();
  }, [fetchPatrocinadores]);

  const handleDelete = async (patrocinador: { id: string }) => {
    await deletePatrocinador(patrocinador.id);
  };

  const handleEdit = (patrocinador: Patrocinador) => {
    setSelectedPatrocinador(patrocinador);
    setEditModalOpen(true);
  };

  const handleView = (patrocinador: Patrocinador) => {
    setSelectedPatrocinador(patrocinador);
    setViewModalOpen(true);
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 animate-fade-in-down">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-sand" />
            <h1 className="text-3xl font-orbitron font-bold">Patrocinadores</h1>
          </div>
          <CreatePatrocinadorModal />
        </div>
        <p className="text-muted-foreground">
          Gerenciar patrocinadores do podcast
        </p>
      </div>

      {/* Tabela de Patrocinadores */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sand"></div>
        </div>
      ) : (
        <PatrocinadoresTable
          patrocinadores={patrocinadores}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onView={handleView}
        />
      )}

      {/* Modais */}
      {selectedPatrocinador && (
        <>
          <ViewPatrocinadorModal
            patrocinador={selectedPatrocinador}
            open={viewModalOpen}
            onOpenChange={setViewModalOpen}
          />
          <EditPatrocinadorModal
            patrocinador={selectedPatrocinador}
            open={editModalOpen}
            onOpenChange={setEditModalOpen}
          />
        </>
      )}
    </div>
  );
}

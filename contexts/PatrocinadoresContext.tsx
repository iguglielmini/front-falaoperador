"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { toast } from "sonner";

export interface Patrocinador {
  id: string;
  nomeEmpresa: string;
  links: string[];
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  imagem: string;
  createdAt: string;
  updatedAt: string;
}

interface CreatePatrocinadorData {
  nomeEmpresa: string;
  links?: string[];
  telefone?: string | null;
  email?: string | null;
  endereco?: string | null;
  imagem?: File | null;
}

interface UpdatePatrocinadorData {
  nomeEmpresa?: string;
  links?: string[];
  telefone?: string | null;
  email?: string | null;
  endereco?: string | null;
  imagem?: File | null;
}

interface PatrocinadoresContextData {
  patrocinadores: Patrocinador[];
  loading: boolean;
  fetchPatrocinadores: () => Promise<void>;
  createPatrocinador: (
    data: CreatePatrocinadorData,
  ) => Promise<Patrocinador | null>;
  updatePatrocinador: (
    id: string,
    data: UpdatePatrocinadorData,
  ) => Promise<Patrocinador | null>;
  deletePatrocinador: (id: string) => Promise<boolean>;
  getPatrocinadorById: (id: string) => Patrocinador | undefined;
}

const PatrocinadoresContext = createContext<PatrocinadoresContextData>(
  {} as PatrocinadoresContextData,
);

export function PatrocinadoresProvider({ children }: { children: ReactNode }) {
  const [patrocinadores, setPatrocinadores] = useState<Patrocinador[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPatrocinadores = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/patrocinadores");

      if (response.ok) {
        const result = await response.json();
        setPatrocinadores(Array.isArray(result.data) ? result.data : []);
      } else {
        toast.error("Erro ao carregar patrocinadores");
      }
    } catch (error) {
      console.error("Erro ao buscar patrocinadores:", error);
      toast.error("Erro ao conectar com o servidor");
      setPatrocinadores([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createPatrocinador = useCallback(
    async (data: CreatePatrocinadorData): Promise<Patrocinador | null> => {
      try {
        // Criar FormData para enviar arquivo de imagem
        const formData = new FormData();

        formData.append("nomeEmpresa", data.nomeEmpresa);
        if (data.links && data.links.length > 0) {
          formData.append("links", JSON.stringify(data.links));
        }
        if (data.telefone) formData.append("telefone", data.telefone);
        if (data.email) formData.append("email", data.email);
        if (data.endereco) formData.append("endereco", data.endereco);
        if (data.imagem) formData.append("imagem", data.imagem);

        const response = await fetch("/api/patrocinadores", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          toast.error(result.error || "Erro ao criar patrocinador");
          return null;
        }

        toast.success("Patrocinador criado com sucesso!");
        await fetchPatrocinadores();
        return result.data;
      } catch (error) {
        console.error("Erro ao criar patrocinador:", error);
        toast.error("Erro ao conectar com o servidor");
        return null;
      }
    },
    [fetchPatrocinadores],
  );

  const updatePatrocinador = useCallback(
    async (
      id: string,
      data: UpdatePatrocinadorData,
    ): Promise<Patrocinador | null> => {
      try {
        const formData = new FormData();

        if (data.nomeEmpresa) formData.append("nomeEmpresa", data.nomeEmpresa);
        if (data.links) {
          formData.append("links", JSON.stringify(data.links));
        }
        if (data.telefone !== undefined) {
          if (data.telefone) {
            formData.append("telefone", data.telefone);
          } else {
            formData.append("telefone", "");
          }
        }
        if (data.email !== undefined) {
          if (data.email) {
            formData.append("email", data.email);
          } else {
            formData.append("email", "");
          }
        }
        if (data.endereco !== undefined) {
          if (data.endereco) {
            formData.append("endereco", data.endereco);
          } else {
            formData.append("endereco", "");
          }
        }
        if (data.imagem) formData.append("imagem", data.imagem);

        const response = await fetch(`/api/patrocinadores/${id}`, {
          method: "PUT",
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          toast.error(result.error || "Erro ao atualizar patrocinador");
          return null;
        }

        toast.success("Patrocinador atualizado com sucesso!");
        await fetchPatrocinadores();
        return result.data;
      } catch (error) {
        console.error("Erro ao atualizar patrocinador:", error);
        toast.error("Erro ao conectar com o servidor");
        return null;
      }
    },
    [fetchPatrocinadores],
  );

  const deletePatrocinador = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const response = await fetch(`/api/patrocinadores/${id}`, {
          method: "DELETE",
        });

        const result = await response.json();

        if (!response.ok) {
          toast.error(result.error || "Erro ao deletar patrocinador");
          return false;
        }

        toast.success("Patrocinador deletado com sucesso!");
        await fetchPatrocinadores();
        return true;
      } catch (error) {
        console.error("Erro ao deletar patrocinador:", error);
        toast.error("Erro ao conectar com o servidor");
        return false;
      }
    },
    [fetchPatrocinadores],
  );

  const getPatrocinadorById = useCallback(
    (id: string) => {
      return patrocinadores.find((p) => p.id === id);
    },
    [patrocinadores],
  );

  return (
    <PatrocinadoresContext.Provider
      value={{
        patrocinadores,
        loading,
        fetchPatrocinadores,
        createPatrocinador,
        updatePatrocinador,
        deletePatrocinador,
        getPatrocinadorById,
      }}
    >
      {children}
    </PatrocinadoresContext.Provider>
  );
}

export function usePatrocinadores() {
  const context = useContext(PatrocinadoresContext);
  if (!context) {
    throw new Error(
      "usePatrocinadores deve ser usado dentro de PatrocinadoresProvider",
    );
  }
  return context;
}

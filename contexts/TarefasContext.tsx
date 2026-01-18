"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { toast } from "sonner";

interface Tarefa {
  id: string;
  titulo: string;
  descricao: string | null;
  status: string;
  prioridade: string;
  publica: boolean;
  dataInicio: string | null;
  dataFim: string | null;
  userId: string;
  user: {
    id: string;
    nome: string;
    sobrenome: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface CreateTarefaData {
  titulo: string;
  descricao?: string | null;
  status: string;
  prioridade: string;
  publica: boolean;
  dataInicio?: string | null;
  dataFim?: string | null;
  userId?: string;
}

interface TarefasContextData {
  tarefas: Tarefa[];
  loading: boolean;
  fetchTarefas: () => Promise<void>;
  createTarefa: (data: CreateTarefaData) => Promise<Tarefa | null>;
  updateTarefa: (id: string, data: Partial<CreateTarefaData>) => Promise<Tarefa | null>;
  deleteTarefa: (id: string) => Promise<boolean>;
  getTarefaById: (id: string) => Tarefa | undefined;
}

const TarefasContext = createContext<TarefasContextData>({} as TarefasContextData);

export function TarefasProvider({ children }: { children: ReactNode }) {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTarefas = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/tarefas");
      
      if (response.ok) {
        const result = await response.json();
        setTarefas(Array.isArray(result.data) ? result.data : []);
      } else {
        toast.error("Erro ao carregar tarefas");
      }
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
      toast.error("Erro ao conectar com o servidor");
      setTarefas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTarefa = useCallback(async (data: CreateTarefaData): Promise<Tarefa | null> => {
    try {
      const response = await fetch("/api/tarefas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Erro ao criar tarefa");
        return null;
      }

      toast.success("Tarefa criada com sucesso!");
      
      // Adiciona a nova tarefa ao estado
      setTarefas((prev) => [result.data, ...prev]);
      
      return result.data;
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      toast.error("Erro ao conectar com o servidor");
      return null;
    }
  }, []);

  const updateTarefa = useCallback(async (id: string, data: Partial<CreateTarefaData>): Promise<Tarefa | null> => {
    try {
      const response = await fetch(`/api/tarefas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Erro ao atualizar tarefa");
        return null;
      }

      toast.success("Tarefa atualizada com sucesso!");
      
      // Atualiza a tarefa no estado
      setTarefas((prev) =>
        prev.map((tarefa) => (tarefa.id === id ? result.data : tarefa))
      );
      
      return result.data;
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      toast.error("Erro ao conectar com o servidor");
      return null;
    }
  }, []);

  const deleteTarefa = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/tarefas/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Tarefa excluída com sucesso!");
        
        // Remove a tarefa do estado
        setTarefas((prev) => prev.filter((tarefa) => tarefa.id !== id));
        
        return true;
      } else {
        const result = await response.json();
        toast.error(result.error || "Erro ao excluir tarefa");
        return false;
      }
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
      toast.error("Erro ao conectar com o servidor");
      return false;
    }
  }, []);

  const getTarefaById = useCallback(
    (id: string): Tarefa | undefined => {
      return tarefas.find((tarefa) => tarefa.id === id);
    },
    [tarefas]
  );

  return (
    <TarefasContext.Provider
      value={{
        tarefas,
        loading,
        fetchTarefas,
        createTarefa,
        updateTarefa,
        deleteTarefa,
        getTarefaById,
      }}
    >
      {children}
    </TarefasContext.Provider>
  );
}

export function useTarefas() {
  const context = useContext(TarefasContext);

  if (!context) {
    throw new Error("useTarefas must be used within a TarefasProvider");
  }

  return context;
}

export type { Tarefa };

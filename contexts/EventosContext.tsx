"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { toast } from "sonner";

export interface EventoParticipante {
  id: string;
  eventoId: string;
  userId: string;
  user: {
    id: string;
    nome: string;
    sobrenome: string;
    email: string;
  };
  createdAt: string;
}

export interface Evento {
  id: string;
  titulo: string;
  descricao: string | null;
  imagem: string | null;
  endereco: string;
  numero: string;
  cep: string;
  latitude: number | null;
  longitude: number | null;
  dataInicio: string;
  dataFim: string;
  criadorId: string;
  criador: {
    id: string;
    nome: string;
    sobrenome: string;
    email: string;
  };
  visibilidade: "PUBLICA" | "PRIVADA";
  categoria: "PODCAST" | "EVENTO" | "ENTREVISTA" | "LIVE" | "OUTRO";
  linkYoutube: string | null;
  participantes: EventoParticipante[];
  createdAt: string;
  updatedAt: string;
}

interface CreateEventoData {
  titulo: string;
  descricao?: string | null;
  imagem?: File | null;
  endereco: string;
  numero: string;
  cep: string;
  dataInicio: string;
  dataFim: string;
  visibilidade?: "PUBLICA" | "PRIVADA";
  categoria?: "PODCAST" | "EVENTO" | "ENTREVISTA" | "LIVE" | "OUTRO";
  linkYoutube?: string | null;
  participantes?: string[];
}

interface UpdateEventoData {
  titulo?: string;
  descricao?: string | null;
  imagem?: File | null;
  endereco?: string;
  numero?: string;
  cep?: string;
  dataInicio?: string;
  dataFim?: string;
  visibilidade?: "PUBLICA" | "PRIVADA";
  categoria?: "PODCAST" | "EVENTO" | "ENTREVISTA" | "LIVE" | "OUTRO";
  linkYoutube?: string | null;
  participantes?: string[];
}

interface EventosContextData {
  eventos: Evento[];
  loading: boolean;
  fetchEventos: () => Promise<void>;
  createEvento: (data: CreateEventoData) => Promise<Evento | null>;
  updateEvento: (id: string, data: UpdateEventoData) => Promise<Evento | null>;
  deleteEvento: (id: string) => Promise<boolean>;
  getEventoById: (id: string) => Evento | undefined;
}

const EventosContext = createContext<EventosContextData>(
  {} as EventosContextData,
);

export function EventosProvider({ children }: { children: ReactNode }) {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEventos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/eventos");

      if (response.ok) {
        const result = await response.json();
        setEventos(Array.isArray(result.data) ? result.data : []);
      } else {
        toast.error("Erro ao carregar eventos");
      }
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
      toast.error("Erro ao conectar com o servidor");
      setEventos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createEvento = useCallback(
    async (data: CreateEventoData): Promise<Evento | null> => {
      try {
        // Criar FormData para enviar arquivo de imagem
        const formData = new FormData();

        formData.append("titulo", data.titulo);
        if (data.descricao) formData.append("descricao", data.descricao);
        if (data.imagem) formData.append("imagem", data.imagem);
        formData.append("endereco", data.endereco);
        formData.append("numero", data.numero);
        formData.append("cep", data.cep);
        formData.append("dataInicio", data.dataInicio);
        formData.append("dataFim", data.dataFim);
        if (data.visibilidade)
          formData.append("visibilidade", data.visibilidade);
        if (data.categoria) formData.append("categoria", data.categoria);
        if (data.linkYoutube) formData.append("linkYoutube", data.linkYoutube);
        if (data.participantes && data.participantes.length > 0) {
          formData.append("participantes", JSON.stringify(data.participantes));
        }

        const response = await fetch("/api/eventos", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          toast.error(result.error || "Erro ao criar evento");
          return null;
        }

        toast.success("Evento criado com sucesso!");

        // Adiciona o novo evento ao estado
        setEventos((prev) => [result.data, ...prev]);

        return result.data;
      } catch (error) {
        console.error("Erro ao criar evento:", error);
        toast.error("Erro ao conectar com o servidor");
        return null;
      }
    },
    [],
  );

  const updateEvento = useCallback(
    async (id: string, data: UpdateEventoData): Promise<Evento | null> => {
      try {
        // Criar FormData para enviar arquivo de imagem
        const formData = new FormData();

        if (data.titulo) formData.append("titulo", data.titulo);
        if (data.descricao !== undefined)
          formData.append("descricao", data.descricao || "");
        if (data.imagem) formData.append("imagem", data.imagem);
        if (data.endereco) formData.append("endereco", data.endereco);
        if (data.numero) formData.append("numero", data.numero);
        if (data.cep) formData.append("cep", data.cep);
        if (data.dataInicio) formData.append("dataInicio", data.dataInicio);
        if (data.dataFim) formData.append("dataFim", data.dataFim);
        if (data.visibilidade)
          formData.append("visibilidade", data.visibilidade);
        if (data.categoria) formData.append("categoria", data.categoria);
        if (data.linkYoutube !== undefined)
          formData.append("linkYoutube", data.linkYoutube || "");
        if (data.participantes) {
          formData.append("participantes", JSON.stringify(data.participantes));
        }

        const response = await fetch(`/api/eventos/${id}`, {
          method: "PUT",
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          toast.error(result.error || "Erro ao atualizar evento");
          return null;
        }

        toast.success("Evento atualizado com sucesso!");

        // Atualiza o evento no estado
        setEventos((prev) =>
          prev.map((evento) => (evento.id === id ? result.data : evento)),
        );

        return result.data;
      } catch (error) {
        console.error("Erro ao atualizar evento:", error);
        toast.error("Erro ao conectar com o servidor");
        return null;
      }
    },
    [],
  );

  const deleteEvento = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/eventos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Evento excluído com sucesso!");

        // Remove o evento do estado
        setEventos((prev) => prev.filter((evento) => evento.id !== id));

        return true;
      } else {
        const result = await response.json();
        toast.error(result.error || "Erro ao excluir evento");
        return false;
      }
    } catch (error) {
      console.error("Erro ao excluir evento:", error);
      toast.error("Erro ao conectar com o servidor");
      return false;
    }
  }, []);

  const getEventoById = useCallback(
    (id: string) => {
      return eventos.find((evento) => evento.id === id);
    },
    [eventos],
  );

  return (
    <EventosContext.Provider
      value={{
        eventos,
        loading,
        fetchEventos,
        createEvento,
        updateEvento,
        deleteEvento,
        getEventoById,
      }}
    >
      {children}
    </EventosContext.Provider>
  );
}

export function useEventos() {
  const context = useContext(EventosContext);

  if (!context) {
    throw new Error("useEventos deve ser usado dentro de um EventosProvider");
  }

  return context;
}

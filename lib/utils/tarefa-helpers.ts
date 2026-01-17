import { StatusTarefa, PrioridadeTarefa } from "@prisma/client";

// Mapeamento de cores para status
export const statusColors: Record<StatusTarefa, string> = {
  PENDENTE: "bg-yellow-500/10 text-yellow-500",
  EM_PROGRESSO: "bg-blue-500/10 text-blue-500",
  CONCLUIDA: "bg-green-500/10 text-green-500",
  CANCELADA: "bg-red-500/10 text-red-500",
};

// Mapeamento de labels para status
export const statusLabels: Record<StatusTarefa, string> = {
  PENDENTE: "Pendente",
  EM_PROGRESSO: "Em Progresso",
  CONCLUIDA: "Concluída",
  CANCELADA: "Cancelada",
};

// Mapeamento de cores para prioridade
export const prioridadeColors: Record<PrioridadeTarefa, string> = {
  BAIXA: "bg-gray-500/10 text-gray-500",
  MEDIA: "bg-blue-500/10 text-blue-500",
  ALTA: "bg-orange-500/10 text-orange-500",
  URGENTE: "bg-red-500/10 text-red-500",
};

// Mapeamento de labels para prioridade
export const prioridadeLabels: Record<PrioridadeTarefa, string> = {
  BAIXA: "Baixa",
  MEDIA: "Média",
  ALTA: "Alta",
  URGENTE: "Urgente",
};

// Helper para obter cor do status
export const getStatusColor = (status: StatusTarefa): string => {
  return statusColors[status] || statusColors.PENDENTE;
};

// Helper para obter label do status
export const getStatusLabel = (status: StatusTarefa): string => {
  return statusLabels[status] || "Desconhecido";
};

// Helper para obter cor da prioridade
export const getPrioridadeColor = (prioridade: PrioridadeTarefa): string => {
  return prioridadeColors[prioridade] || prioridadeColors.MEDIA;
};

// Helper para obter label da prioridade
export const getPrioridadeLabel = (prioridade: PrioridadeTarefa): string => {
  return prioridadeLabels[prioridade] || "Desconhecido";
};

// Helper para formatear data
export const formatDate = (date: string | Date | null): string => {
  if (!date) return "Sem data";
  return new Date(date).toLocaleDateString("pt-BR");
};

// Helper para formatear data e hora
export const formatDateTime = (date: string | Date | null): string => {
  if (!date) return "Sem data";
  return new Date(date).toLocaleString("pt-BR");
};

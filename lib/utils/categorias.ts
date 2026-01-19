export const categoriaLabels = {
  PODCAST: "Podcast",
  EVENTO: "Evento",
  ENTREVISTA: "Entrevista",
  LIVE: "Live",
  OUTRO: "Outro",
} as const;

export const categoriaColors = {
  PODCAST: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  EVENTO: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  ENTREVISTA: "bg-green-500/10 text-green-600 border-green-500/20",
  LIVE: "bg-red-500/10 text-red-600 border-red-500/20",
  OUTRO: "bg-gray-500/10 text-gray-600 border-gray-500/20",
} as const;

export type Categoria = keyof typeof categoriaLabels;

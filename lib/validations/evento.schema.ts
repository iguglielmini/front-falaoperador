import { z } from "zod";

// Schema base sem refinements
const eventoSchemaBase = z.object({
  titulo: z
    .string()
    .min(3, "Título deve ter no mínimo 3 caracteres")
    .max(100, "Título deve ter no máximo 100 caracteres"),
  descricao: z
    .string()
    .max(1000, "Descrição deve ter no máximo 1000 caracteres")
    .optional()
    .nullable(),
  endereco: z.string().min(5, "Endereço deve ter no mínimo 5 caracteres"),
  numero: z.string().min(1, "Número é obrigatório"),
  cep: z
    .string()
    .regex(/^\d{5}-?\d{3}$/, "CEP inválido (formato: 00000-000)"),
  dataInicio: z.string().datetime("Data de início inválida"),
  dataFim: z.string().datetime("Data de fim inválida"),
  visibilidade: z.enum(["PUBLICA", "PRIVADA"]).default("PUBLICA"),
  categoria: z
    .enum(["PODCAST", "EVENTO", "ENTREVISTA", "LIVE", "OUTRO"])
    .default("EVENTO"),
  linkYoutube: z.string().url("Link do YouTube inválido").optional().nullable(),
  participantes: z.array(z.string().uuid()).optional().default([]),
});

// Schema de criação com refinement de validação de datas
export const createEventoSchema = eventoSchemaBase.refine(
  (data) => {
    const inicio = new Date(data.dataInicio);
    const fim = new Date(data.dataFim);
    return fim > inicio;
  },
  {
    message: "Data de fim deve ser posterior à data de início",
    path: ["dataFim"],
  }
);

// Schema de atualização (partial do base, sem refinement)
export const updateEventoSchema = eventoSchemaBase.partial().refine(
  (data) => {
    // Só valida datas se ambas forem fornecidas
    if (data.dataInicio && data.dataFim) {
      const inicio = new Date(data.dataInicio);
      const fim = new Date(data.dataFim);
      return fim > inicio;
    }
    return true;
  },
  {
    message: "Data de fim deve ser posterior à data de início",
    path: ["dataFim"],
  }
);

export type CreateEventoInput = z.infer<typeof createEventoSchema>;
export type UpdateEventoInput = z.infer<typeof updateEventoSchema>;


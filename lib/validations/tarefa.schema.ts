import { z } from "zod";
import { StatusTarefa, PrioridadeTarefa } from "@prisma/client";

// Schema para criação de tarefa
export const createTarefaSchema = z.object({
  titulo: z
    .string()
    .min(3, "Título deve ter no mínimo 3 caracteres")
    .max(100, "Título deve ter no máximo 100 caracteres"),

  descricao: z
    .string()
    .max(500, "Descrição deve ter no máximo 500 caracteres")
    .optional(),

  status: z.nativeEnum(StatusTarefa).optional().default(StatusTarefa.PENDENTE),

  prioridade: z
    .nativeEnum(PrioridadeTarefa)
    .optional()
    .default(PrioridadeTarefa.MEDIA),

  publica: z.boolean().optional().default(false),

  dataInicio: z
    .string()
    .datetime({ message: "Data de início inválida" })
    .or(
      z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de data inválido (YYYY-MM-DD)")
    )
    .transform((val) => new Date(val))
    .optional(),

  dataFim: z
    .string()
    .datetime({ message: "Data fim inválida" })
    .or(
      z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de data inválido (YYYY-MM-DD)")
    )
    .transform((val) => new Date(val))
    .optional(),
});

// Schema para atualização de tarefa
export const updateTarefaSchema = z.object({
  titulo: z
    .string()
    .min(3, "Título deve ter no mínimo 3 caracteres")
    .max(100, "Título deve ter no máximo 100 caracteres")
    .optional(),

  descricao: z
    .string()
    .max(500, "Descrição deve ter no máximo 500 caracteres")
    .optional(),

  status: z.nativeEnum(StatusTarefa).optional(),

  prioridade: z.nativeEnum(PrioridadeTarefa).optional(),

  publica: z.boolean().optional(),

  dataInicio: z
    .string()
    .datetime({ message: "Data de início inválida" })
    .or(
      z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de data inválido (YYYY-MM-DD)")
    )
    .transform((val) => new Date(val))
    .optional(),

  dataFim: z
    .string()
    .datetime({ message: "Data fim inválida" })
    .or(
      z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de data inválido (YYYY-MM-DD)")
    )
    .transform((val) => new Date(val))
    .optional(),
});

export type CreateTarefaInput = z.infer<typeof createTarefaSchema>;
export type UpdateTarefaInput = z.infer<typeof updateTarefaSchema>;

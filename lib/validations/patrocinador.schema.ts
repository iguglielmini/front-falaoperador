import { z } from "zod";

/**
 * Schema de validação para criação de patrocinador
 */
export const createPatrocinadorSchema = z.object({
  nomeEmpresa: z
    .string()
    .min(1, "Nome da empresa é obrigatório")
    .max(255, "Nome da empresa deve ter no máximo 255 caracteres"),
  
  links: z
    .array(z.string().url("Link inválido"))
    .min(0, "Links deve ser um array")
    .default([]),
  
  telefone: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val || null),
  
  email: z
    .string()
    .email("Email inválido")
    .optional()
    .nullable()
    .transform((val) => val || null),
  
  endereco: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val || null),
  
  imagem: z
    .string()
    .min(1, "Imagem é obrigatória")
    .optional(), // Será adicionada pelo backend após upload
});

/**
 * Schema de validação para atualização de patrocinador
 */
export const updatePatrocinadorSchema = z.object({
  nomeEmpresa: z
    .string()
    .min(1, "Nome da empresa é obrigatório")
    .max(255, "Nome da empresa deve ter no máximo 255 caracteres")
    .optional(),
  
  links: z
    .array(z.string().url("Link inválido"))
    .min(0, "Links deve ser um array")
    .optional(),
  
  telefone: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val || null),
  
  email: z
    .string()
    .email("Email inválido")
    .optional()
    .nullable()
    .transform((val) => val || null),
  
  endereco: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val || null),
  
  imagem: z
    .string()
    .min(1, "Imagem é obrigatória")
    .optional(),
});

export type CreatePatrocinadorData = z.infer<typeof createPatrocinadorSchema>;
export type UpdatePatrocinadorData = z.infer<typeof updatePatrocinadorSchema>;

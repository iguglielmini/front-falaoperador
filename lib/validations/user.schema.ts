import { z } from "zod";
import { PerfilUsuario } from "@prisma/client";

// Schema para criação de usuário
export const createUserSchema = z.object({
  nome: z
    .string()
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(50, "Nome deve ter no máximo 50 caracteres"),

  sobrenome: z
    .string()
    .min(2, "Sobrenome deve ter no mínimo 2 caracteres")
    .max(50, "Sobrenome deve ter no máximo 50 caracteres"),

  email: z.string().email("Email inválido").toLowerCase(),

  password: z
    .string()
    .min(6, "Senha deve ter no mínimo 6 caracteres")
    .max(100, "Senha deve ter no máximo 100 caracteres"),

  telefone: z
    .string()
    .regex(/^[\d\s\(\)\-\+]+$/, "Formato de telefone inválido")
    .min(10, "Telefone deve ter no mínimo 10 dígitos"),

  dataNascimento: z
    .string()
    .datetime({ message: "Data de nascimento inválida" })
    .or(
      z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de data inválido (YYYY-MM-DD)")
    )
    .transform((val) => new Date(val)),

  perfil: z.nativeEnum(PerfilUsuario).optional().default(PerfilUsuario.USUARIO),
});

// Schema para atualização de usuário
export const updateUserSchema = z.object({
  nome: z
    .string()
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(50, "Nome deve ter no máximo 50 caracteres")
    .optional(),

  sobrenome: z
    .string()
    .min(2, "Sobrenome deve ter no mínimo 2 caracteres")
    .max(50, "Sobrenome deve ter no máximo 50 caracteres")
    .optional(),

  email: z.string().email("Email inválido").toLowerCase().optional(),

  password: z
    .string()
    .min(6, "Senha deve ter no mínimo 6 caracteres")
    .max(100, "Senha deve ter no máximo 100 caracteres")
    .optional(),

  telefone: z
    .string()
    .regex(/^[\d\s\(\)\-\+]+$/, "Formato de telefone inválido")
    .min(10, "Telefone deve ter no mínimo 10 dígitos")
    .optional(),

  dataNascimento: z
    .string()
    .datetime({ message: "Data de nascimento inválida" })
    .or(
      z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de data inválido (YYYY-MM-DD)")
    )
    .transform((val) => new Date(val))
    .optional(),

  perfil: z.nativeEnum(PerfilUsuario).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

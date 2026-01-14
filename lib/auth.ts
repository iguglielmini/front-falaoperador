import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { comparePassword, hashPassword } from "@/lib/utils/password";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    password: {
      async hash(password) {
        return hashPassword(password);
      },
      async verify({ password, hash }) {
        return comparePassword(password, hash);
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 dias
    updateAge: 60 * 60 * 24, // atualiza a cada 24 horas
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutos
    },
  },
  user: {
    additionalFields: {
      nome: {
        type: "string",
        required: true,
      },
      sobrenome: {
        type: "string",
        required: true,
      },
      telefone: {
        type: "string",
        required: true,
      },
      dataNascimento: {
        type: "date",
        required: true,
      },
      perfil: {
        type: "string",
        required: true,
        defaultValue: "USUARIO",
      },
    },
  },
});

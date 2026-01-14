import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { comparePassword } from "@/lib/utils/password";
import { successResponse, errorResponse } from "@/lib/utils/api-response";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Autenticar usuário
 *     description: Realiza login do usuário
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 *       500:
 *         description: Erro no servidor
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validação
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      const details: Record<string, string[]> = {};
      validation.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!details[path]) details[path] = [];
        details[path].push(issue.message);
      });
      return errorResponse("Dados inválidos", 400, details);
    }

    const { email, password } = validation.data;

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return errorResponse("Email ou senha inválidos", 401);
    }

    // Verificar senha
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return errorResponse("Email ou senha inválidos", 401);
    }

    // Remover senha do retorno
    const { password: _, ...userWithoutPassword } = user;

    return successResponse(
      {
        user: userWithoutPassword,
      },
      200,
      "Login realizado com sucesso"
    );
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return errorResponse("Erro ao fazer login", 500);
  }
}

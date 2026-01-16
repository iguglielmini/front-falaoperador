import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createTarefaSchema } from "@/lib/validations/tarefa.schema";
import { validateRequest } from "@/lib/middleware/validation";
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/utils/api-response";

// GET - Listar tarefas (usuário vê apenas suas tarefas + tarefas públicas, admin vê tudo)
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      return errorResponse("Não autenticado", 401);
    }

    const userId = session.user.id;
    const userPerfil = session.user.perfil;

    // Admin vê todas as tarefas
    if (userPerfil === "ADMIN") {
      const tarefas = await prisma.tarefa.findMany({
        include: {
          user: {
            select: {
              id: true,
              nome: true,
              sobrenome: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return successResponse(tarefas);
    }

    // Usuário comum vê apenas suas tarefas + tarefas públicas
    const tarefas = await prisma.tarefa.findMany({
      where: {
        OR: [{ userId }, { publica: true }],
      },
      include: {
        user: {
          select: {
            id: true,
            nome: true,
            sobrenome: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return successResponse(tarefas);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST - Criar nova tarefa
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      return errorResponse("Não autenticado", 401);
    }

    // Validar dados de entrada com Zod
    const validatedData = await validateRequest(request, createTarefaSchema);

    // Criar tarefa associada ao usuário autenticado
    const tarefa = await prisma.tarefa.create({
      data: {
        ...validatedData,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            nome: true,
            sobrenome: true,
            email: true,
          },
        },
      },
    });

    return successResponse(tarefa, 201, "Tarefa criada com sucesso");
  } catch (error) {
    return handleApiError(error);
  }
}

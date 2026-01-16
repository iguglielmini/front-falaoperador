import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { updateTarefaSchema } from "@/lib/validations/tarefa.schema";
import { validateRequest } from "@/lib/middleware/validation";
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/utils/api-response";

// GET - Buscar tarefa específica
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      return errorResponse("Não autenticado", 401);
    }

    const { id } = await params;
    const userId = session.user.id;
    const userPerfil = session.user.perfil;

    const tarefa = await prisma.tarefa.findUnique({
      where: { id },
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

    if (!tarefa) {
      return errorResponse("Tarefa não encontrada", 404);
    }

    // Verificar permissão: dono, admin ou tarefa pública
    if (tarefa.userId !== userId && userPerfil !== "ADMIN" && !tarefa.publica) {
      return errorResponse("Sem permissão para visualizar esta tarefa", 403);
    }

    return successResponse(tarefa);
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT - Atualizar tarefa
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      return errorResponse("Não autenticado", 401);
    }

    const { id } = await params;
    const userId = session.user.id;
    const userPerfil = session.user.perfil;

    // Verificar se a tarefa existe
    const tarefaExistente = await prisma.tarefa.findUnique({
      where: { id },
    });

    if (!tarefaExistente) {
      return errorResponse("Tarefa não encontrada", 404);
    }

    // Verificar permissão: apenas dono ou admin
    if (tarefaExistente.userId !== userId && userPerfil !== "ADMIN") {
      return errorResponse("Sem permissão para editar esta tarefa", 403);
    }

    // Validar dados de entrada
    const validatedData = await validateRequest(request, updateTarefaSchema);

    // Atualizar tarefa
    const tarefaAtualizada = await prisma.tarefa.update({
      where: { id },
      data: validatedData,
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

    return successResponse(
      tarefaAtualizada,
      200,
      "Tarefa atualizada com sucesso"
    );
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE - Excluir tarefa
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      return errorResponse("Não autenticado", 401);
    }

    const { id } = await params;
    const userId = session.user.id;
    const userPerfil = session.user.perfil;

    // Verificar se a tarefa existe
    const tarefa = await prisma.tarefa.findUnique({
      where: { id },
    });

    if (!tarefa) {
      return errorResponse("Tarefa não encontrada", 404);
    }

    // Verificar permissão: apenas dono ou admin
    if (tarefa.userId !== userId && userPerfil !== "ADMIN") {
      return errorResponse("Sem permissão para excluir esta tarefa", 403);
    }

    // Excluir tarefa
    await prisma.tarefa.delete({
      where: { id },
    });

    return successResponse(null, 200, "Tarefa excluída com sucesso");
  } catch (error) {
    return handleApiError(error);
  }
}

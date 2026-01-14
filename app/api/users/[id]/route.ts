/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { updateUserSchema } from "@/lib/validations/user.schema";
import { validateRequest } from "@/lib/middleware/validation";
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/utils/api-response";
import { hashPassword } from "@/lib/utils/password";

// GET - Buscar usuário por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        sobrenome: true,
        email: true,
        telefone: true,
        dataNascimento: true,
        perfil: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return errorResponse("Usuário não encontrado", 404);
    }

    return successResponse(user);
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT - Atualizar usuário
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validar dados de entrada com Zod
    const validatedData = await validateRequest(request, updateUserSchema);

    // Verificar se usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return errorResponse("Usuário não encontrado", 404);
    }

    // Se email está sendo alterado, verificar se já existe
    if (validatedData.email && validatedData.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });

      if (emailExists) {
        return errorResponse("Email já cadastrado", 400);
      }
    }

    // Preparar dados para atualização
    const updateData: any = { ...validatedData };

    // Hash da senha se estiver sendo atualizada
    if (validatedData.password) {
      updateData.password = await hashPassword(validatedData.password);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        nome: true,
        sobrenome: true,
        email: true,
        telefone: true,
        dataNascimento: true,
        perfil: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return successResponse(user, 200, "Usuário atualizado com sucesso");
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE - Deletar usuário
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verificar se usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return errorResponse("Usuário não encontrado", 404);
    }

    await prisma.user.delete({
      where: { id },
    });

    return successResponse({ id }, 200, "Usuário deletado com sucesso");
  } catch (error) {
    return handleApiError(error);
  }
}

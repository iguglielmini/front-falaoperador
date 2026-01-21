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
import { saveUploadedFile, validateImageFile } from "@/lib/utils/file-upload";
import fs from "fs/promises";
import path from "path";

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
        foto: true,
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

    // Verificar se é FormData (com foto) ou JSON
    const contentType = request.headers.get('content-type');
    let validatedData;
    let fotoPath: string | null = null;

    if (contentType?.includes('multipart/form-data')) {
      // Processar FormData com foto
      const formData = await request.formData();
      
      const data: Record<string, any> = {};
      const fields = ['nome', 'sobrenome', 'email', 'password', 'telefone', 'dataNascimento', 'perfil'];
      
      fields.forEach((field) => {
        if (formData.has(field)) {
          data[field] = formData.get(field);
        }
      });

      validatedData = updateUserSchema.parse(data);
    } else {
      // Validar dados JSON
      validatedData = await validateRequest(request, updateUserSchema);
    }

    // Verificar se usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return errorResponse("Usuário não encontrado", 404);
    }

    // Processar upload de nova foto (se houver FormData)
    if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData();
      const fotoFile = formData.get('foto') as File | null;

      if (fotoFile && fotoFile.size > 0) {
        const validation = validateImageFile(fotoFile);
        if (!validation.valid) {
          return errorResponse(validation.error || 'Imagem inválida', 400);
        }

        // Deletar foto antiga se existir
        if (existingUser.foto) {
          try {
            const oldFotoPath = path.join(process.cwd(), 'public', existingUser.foto);
            await fs.unlink(oldFotoPath);
          } catch (error) {
            console.error('Erro ao deletar foto antiga:', error);
          }
        }

        // Salvar nova foto
        fotoPath = await saveUploadedFile(fotoFile, 'usuarios');
      }
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

    // Adicionar foto se foi feito upload
    if (fotoPath) {
      updateData.foto = fotoPath;
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
        foto: true,
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

    // Deletar foto se existir
    if (existingUser.foto) {
      try {
        const fotoPath = path.join(process.cwd(), 'public', existingUser.foto);
        await fs.unlink(fotoPath);
      } catch (error) {
        console.error('Erro ao deletar foto:', error);
      }
    }

    await prisma.user.delete({
      where: { id },
    });

    return successResponse({ id }, 200, "Usuário deletado com sucesso");
  } catch (error) {
    return handleApiError(error);
  }
}

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { updatePatrocinadorSchema } from "@/lib/validations/patrocinador.schema";
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/utils/api-response";
import { saveUploadedFile, validateImageFile } from "@/lib/utils/file-upload";
import fs from "fs/promises";
import path from "path";

/**
 * Helper para extrair dados do FormData de forma type-safe
 */
function extractPatrocinadorDataFromFormData(formData: FormData) {
  const data: Record<string, string | string[] | null> = {};

  const fields = ["nomeEmpresa", "telefone", "email", "endereco"] as const;

  fields.forEach((field) => {
    if (formData.has(field)) {
      const value = formData.get(field);
      data[field] = value === "" ? null : (value as string);
    }
  });

  // Processar array de links
  if (formData.has("links")) {
    try {
      const linksValue = formData.get("links") as string;
      data.links = linksValue ? JSON.parse(linksValue) : [];
    } catch {
      data.links = [];
    }
  }

  return data;
}

/**
 * GET /api/patrocinadores/[id]
 * Buscar patrocinador por ID (acesso público)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const patrocinador = await prisma.patrocinador.findUnique({
      where: { id },
    });

    if (!patrocinador) {
      return errorResponse("Patrocinador não encontrado", 404);
    }

    // Parsear links de JSON string para array
    return successResponse({
      ...patrocinador,
      links: JSON.parse(patrocinador.links),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/patrocinadores/[id]
 * Atualizar patrocinador (requer autenticação de admin)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      return errorResponse("Não autenticado", 401);
    }

    // Apenas admins podem atualizar patrocinadores
    if (session.user.perfil !== "ADMIN") {
      return errorResponse("Sem permissão para atualizar patrocinadores", 403);
    }

    const { id } = await params;

    // Verificar se patrocinador existe
    const patrocinadorExistente = await prisma.patrocinador.findUnique({
      where: { id },
    });

    if (!patrocinadorExistente) {
      return errorResponse("Patrocinador não encontrado", 404);
    }

    // Processar FormData
    const formData = await request.formData();
    const data = extractPatrocinadorDataFromFormData(formData);

    // Processar upload de nova imagem (se houver)
    let imagemPath = patrocinadorExistente.imagem;
    const imageFile = formData.get("imagem") as File | null;

    if (imageFile && imageFile.size > 0) {
      const validation = validateImageFile(imageFile);
      if (!validation.valid) {
        return errorResponse(validation.error || "Imagem inválida", 400);
      }

      // Deletar imagem antiga se existir
      if (patrocinadorExistente.imagem) {
        try {
          const oldImagePath = path.join(
            process.cwd(),
            "public",
            patrocinadorExistente.imagem,
          );
          await fs.unlink(oldImagePath);
        } catch (error) {
          console.error("Erro ao deletar imagem antiga:", error);
        }
      }

      // Salvar nova imagem
      const newImagePath = await saveUploadedFile(imageFile, "patrocinadores");

      if (!newImagePath) {
        return errorResponse("Erro ao salvar imagem", 500);
      }

      imagemPath = newImagePath;
      data.imagem = imagemPath;
    }

    // Validar dados com Zod
    const validatedData = updatePatrocinadorSchema.parse(data);

    // Atualizar patrocinador
    const updateData: Record<string, unknown> = {};

    if (validatedData.nomeEmpresa)
      updateData.nomeEmpresa = validatedData.nomeEmpresa;
    if (validatedData.links)
      updateData.links = JSON.stringify(validatedData.links);
    if (validatedData.telefone !== undefined)
      updateData.telefone = validatedData.telefone;
    if (validatedData.email !== undefined)
      updateData.email = validatedData.email;
    if (validatedData.endereco !== undefined)
      updateData.endereco = validatedData.endereco;
    if (validatedData.imagem) updateData.imagem = validatedData.imagem;

    const patrocinador = await prisma.patrocinador.update({
      where: { id },
      data: updateData,
    });

    // Retornar com links parseados
    return successResponse({
      ...patrocinador,
      links: JSON.parse(patrocinador.links),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/patrocinadores/[id]
 * Deletar patrocinador (requer autenticação de admin)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      return errorResponse("Não autenticado", 401);
    }

    // Apenas admins podem deletar patrocinadores
    if (session.user.perfil !== "ADMIN") {
      return errorResponse("Sem permissão para deletar patrocinadores", 403);
    }

    const { id } = await params;

    // Verificar se patrocinador existe
    const patrocinador = await prisma.patrocinador.findUnique({
      where: { id },
    });

    if (!patrocinador) {
      return errorResponse("Patrocinador não encontrado", 404);
    }

    // Deletar imagem se existir
    if (patrocinador.imagem) {
      try {
        const imagePath = path.join(
          process.cwd(),
          "public",
          patrocinador.imagem,
        );
        await fs.unlink(imagePath);
      } catch (error) {
        console.error("Erro ao deletar imagem:", error);
      }
    }

    // Deletar patrocinador
    await prisma.patrocinador.delete({
      where: { id },
    });

    return successResponse({ message: "Patrocinador deletado com sucesso" });
  } catch (error) {
    return handleApiError(error);
  }
}

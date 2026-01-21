import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createPatrocinadorSchema } from "@/lib/validations/patrocinador.schema";
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/utils/api-response";
import { saveUploadedFile, validateImageFile } from "@/lib/utils/file-upload";

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
  } else {
    data.links = [];
  }

  return data;
}

/**
 * GET /api/patrocinadores
 * Lista todos os patrocinadores (acesso público)
 */
export async function GET(request: NextRequest) {
  try {
    const patrocinadores = await prisma.patrocinador.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // Parsear links de JSON string para array
    const patrocinadoresFormatted = patrocinadores.map((p) => ({
      ...p,
      links: JSON.parse(p.links),
    }));

    return successResponse(patrocinadoresFormatted);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/patrocinadores
 * Criar novo patrocinador (requer autenticação de admin)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      return errorResponse("Não autenticado", 401);
    }

    // Apenas admins podem criar patrocinadores
    if (session.user.perfil !== "ADMIN") {
      return errorResponse("Sem permissão para criar patrocinadores", 403);
    }

    // Processar FormData (para suportar upload de imagem)
    const formData = await request.formData();
    const data = extractPatrocinadorDataFromFormData(formData);

    // Processar upload de imagem (obrigatório)
    const imageFile = formData.get("imagem") as File | null;

    if (!imageFile || imageFile.size === 0) {
      return errorResponse("Imagem é obrigatória", 400);
    }

    const validation = validateImageFile(imageFile);
    if (!validation.valid) {
      return errorResponse(validation.error || "Imagem inválida", 400);
    }

    const imagemPath = await saveUploadedFile(
      imageFile,
      "patrocinadores",
    );

    data.imagem = imagemPath;

    // Validar dados com Zod
    const validatedData = createPatrocinadorSchema.parse(data);

    // Criar patrocinador no banco
    const patrocinador = await prisma.patrocinador.create({
      data: {
        nomeEmpresa: validatedData.nomeEmpresa,
        links: JSON.stringify(validatedData.links),
        telefone: validatedData.telefone,
        email: validatedData.email,
        endereco: validatedData.endereco,
        imagem: validatedData.imagem!,
      },
    });

    // Retornar com links parseados
    return successResponse(
      {
        ...patrocinador,
        links: JSON.parse(patrocinador.links),
      },
      201,
    );
  } catch (error) {
    return handleApiError(error);
  }
}

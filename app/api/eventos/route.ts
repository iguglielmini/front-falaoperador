import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createEventoSchema } from "@/lib/validations/evento.schema";
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/utils/api-response";
import { getCoordinatesFromAddress } from "@/lib/utils/geocoding";
import { saveUploadedFile, validateImageFile } from "@/lib/utils/file-upload";
import { Prisma, CategoriaEvento, VisibilidadeEvento } from "@prisma/client";

/**
 * Helper para extrair dados do FormData de forma type-safe
 */
function extractEventoDataFromFormData(formData: FormData) {
  const data: Record<string, string | string[] | null> = {};

  const fields = [
    "titulo",
    "descricao",
    "endereco",
    "numero",
    "cep",
    "dataInicio",
    "dataFim",
    "visibilidade",
    "categoria",
    "linkYoutube",
  ] as const;

  fields.forEach((field) => {
    if (formData.has(field)) {
      const value = formData.get(field);
      data[field] = value === "" ? null : (value as string);
    }
  });

  // Processar array de participantes
  if (formData.has("participantes")) {
    try {
      data.participantes = JSON.parse(
        (formData.get("participantes") as string) || "[]",
      );
    } catch {
      data.participantes = [];
    }
  }

  return data;
}

// GET - Listar eventos (com filtros por visibilidade e categoria)
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      return errorResponse("Não autenticado", 401);
    }

    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get("categoria");
    const visibilidade = searchParams.get("visibilidade");

    const whereClause: Prisma.EventoWhereInput = {};

    // Filtrar por categoria se especificado
    if (categoria) {
      whereClause.categoria = categoria as CategoriaEvento;
    }

    // Usuário comum vê apenas eventos públicos + eventos privados onde é participante ou criador
    if (session.user.perfil !== "ADMIN") {
      whereClause.OR = [
        { visibilidade: "PUBLICA" },
        { criadorId: session.user.id },
        {
          participantes: {
            some: {
              userId: session.user.id,
            },
          },
        },
      ];
    } else if (visibilidade) {
      // Admin pode filtrar por visibilidade
      whereClause.visibilidade = visibilidade as VisibilidadeEvento;
    }

    const eventos = await prisma.evento.findMany({
      where: whereClause,
      include: {
        criador: {
          select: {
            id: true,
            nome: true,
            sobrenome: true,
            email: true,
          },
        },
        participantes: {
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
        },
      },
      orderBy: {
        dataInicio: "asc",
      },
    });

    return successResponse(eventos);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST - Criar novo evento
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      return errorResponse("Não autenticado", 401);
    }

    // Processar FormData (para suportar upload de imagem)
    const formData = await request.formData();
    const data = extractEventoDataFromFormData(formData);

    // Validar dados com Zod
    const validatedData = createEventoSchema.parse(data);

    // Processar upload de imagem (se houver)
    let imagemPath: string | null = null;
    const imageFile = formData.get("imagem") as File | null;
    
    if (imageFile && imageFile.size > 0) {
      const validation = validateImageFile(imageFile);
      if (!validation.valid) {
        return errorResponse(validation.error || "Imagem inválida", 400);
      }

      imagemPath = await saveUploadedFile(imageFile, "eventos");
      if (!imagemPath) {
        return errorResponse("Erro ao salvar imagem", 500);
      }
    }

    // Obter coordenadas do endereço (geolocalização)
    const coordinates = await getCoordinatesFromAddress(
      validatedData.endereco,
      validatedData.numero,
      validatedData.cep
    );

    // Criar evento
    const evento = await prisma.evento.create({
      data: {
        titulo: validatedData.titulo,
        descricao: validatedData.descricao,
        imagem: imagemPath,
        endereco: validatedData.endereco,
        numero: validatedData.numero,
        cep: validatedData.cep,
        latitude: coordinates?.latitude,
        longitude: coordinates?.longitude,
        dataInicio: new Date(validatedData.dataInicio),
        dataFim: new Date(validatedData.dataFim),
        criadorId: session.user.id,
        visibilidade: validatedData.visibilidade,
        categoria: validatedData.categoria,
        linkYoutube: validatedData.linkYoutube,
        participantes: {
          create: validatedData.participantes.map((userId) => ({
            userId,
          })),
        },
      },
      include: {
        criador: {
          select: {
            id: true,
            nome: true,
            sobrenome: true,
            email: true,
          },
        },
        participantes: {
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
        },
      },
    });

    return successResponse(evento, 201, "Evento criado com sucesso");
  } catch (error) {
    return handleApiError(error);
  }
}

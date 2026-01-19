import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { updateEventoSchema } from "@/lib/validations/evento.schema";
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/utils/api-response";
import { getCoordinatesFromAddress } from "@/lib/utils/geocoding";
import { saveUploadedFile, validateImageFile } from "@/lib/utils/file-upload";

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

// GET - Buscar evento por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      return errorResponse("Não autenticado", 401);
    }

    const { id } = await params;

    const evento = await prisma.evento.findUnique({
      where: { id },
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

    if (!evento) {
      return errorResponse("Evento não encontrado", 404);
    }

    // Verificar permissão de visualização
    const isParticipante = evento.participantes.some(
      (p) => p.userId === session.user.id,
    );
    const isCriador = evento.criadorId === session.user.id;
    const isAdmin = session.user.perfil === "ADMIN";
    const isPublico = evento.visibilidade === "PUBLICA";

    if (!isPublico && !isCriador && !isParticipante && !isAdmin) {
      return errorResponse("Sem permissão para visualizar este evento", 403);
    }

    return successResponse(evento);
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT - Atualizar evento
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      return errorResponse("Não autenticado", 401);
    }

    const { id } = await params;

    // Buscar evento existente
    const eventoExistente = await prisma.evento.findUnique({
      where: { id },
    });

    if (!eventoExistente) {
      return errorResponse("Evento não encontrado", 404);
    }

    // Verificar permissão (apenas criador ou admin podem editar)
    if (
      eventoExistente.criadorId !== session.user.id &&
      session.user.perfil !== "ADMIN"
    ) {
      return errorResponse("Sem permissão para editar este evento", 403);
    }

    // Processar FormData
    const formData = await request.formData();
    const data = extractEventoDataFromFormData(formData);

    // Validar dados
    const validatedData = updateEventoSchema.parse(data);

    // Processar nova imagem (se houver)
    let imagemPath = eventoExistente.imagem;
    const imageFile = formData.get("imagem") as File | null;

    if (imageFile && imageFile.size > 0) {
      const validation = validateImageFile(imageFile);
      if (!validation.valid) {
        return errorResponse(validation.error || "Imagem inválida", 400);
      }

      const newImagePath = await saveUploadedFile(imageFile, "eventos");
      if (newImagePath) {
        imagemPath = newImagePath;
      }
    }

    // Atualizar coordenadas se endereço mudou
    let coordinates = null;
    if (validatedData.endereco || validatedData.numero || validatedData.cep) {
      coordinates = await getCoordinatesFromAddress(
        validatedData.endereco || eventoExistente.endereco,
        validatedData.numero || eventoExistente.numero,
        validatedData.cep || eventoExistente.cep,
      );
    }

    // Atualizar evento
    const evento = await prisma.evento.update({
      where: { id },
      data: {
        ...(validatedData.titulo && { titulo: validatedData.titulo }),
        ...(validatedData.descricao !== undefined && {
          descricao: validatedData.descricao,
        }),
        ...(imagemPath && { imagem: imagemPath }),
        ...(validatedData.endereco && { endereco: validatedData.endereco }),
        ...(validatedData.numero && { numero: validatedData.numero }),
        ...(validatedData.cep && { cep: validatedData.cep }),
        ...(coordinates && {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        }),
        ...(validatedData.dataInicio && {
          dataInicio: new Date(validatedData.dataInicio),
        }),
        ...(validatedData.dataFim && {
          dataFim: new Date(validatedData.dataFim),
        }),
        ...(validatedData.visibilidade && {
          visibilidade: validatedData.visibilidade,
        }),
        ...(validatedData.categoria && { categoria: validatedData.categoria }),
        ...(validatedData.linkYoutube !== undefined && {
          linkYoutube: validatedData.linkYoutube,
        }),
        ...(validatedData.participantes && {
          participantes: {
            deleteMany: {},
            create: validatedData.participantes.map((userId: string) => ({
              userId,
            })),
          },
        }),
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

    return successResponse(evento, 200, "Evento atualizado com sucesso");
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE - Excluir evento
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      return errorResponse("Não autenticado", 401);
    }

    const { id } = await params;

    // Buscar evento
    const evento = await prisma.evento.findUnique({
      where: { id },
    });

    if (!evento) {
      return errorResponse("Evento não encontrado", 404);
    }

    // Verificar permissão (apenas criador ou admin podem excluir)
    if (
      evento.criadorId !== session.user.id &&
      session.user.perfil !== "ADMIN"
    ) {
      return errorResponse("Sem permissão para excluir este evento", 403);
    }

    // Excluir evento (participantes são excluídos em cascata)
    await prisma.evento.delete({
      where: { id },
    });

    return successResponse(null, 200, "Evento excluído com sucesso");
  } catch (error) {
    return handleApiError(error);
  }
}

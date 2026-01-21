import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { createUserSchema } from "@/lib/validations/user.schema";
import { validateRequest } from "@/lib/middleware/validation";
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/utils/api-response";
import { hashPassword } from "@/lib/utils/password";
import { saveUploadedFile, validateImageFile } from "@/lib/utils/file-upload";

// GET - Listar todos os usuários
export async function GET() {
  try {
    const users = await prisma.user.findMany({
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
        // Não retorna password por segurança
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return successResponse(users);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST - Criar novo usuário
export async function POST(request: NextRequest) {
  try {
    // Verificar se é FormData (com foto) ou JSON
    const contentType = request.headers.get("content-type");
    let validatedData;
    let fotoPath: string | null = null;

    if (contentType?.includes("multipart/form-data")) {
      // Processar FormData com foto
      const formData = await request.formData();

      const data: Record<string, unknown> = {};
      const fields = [
        "nome",
        "sobrenome",
        "email",
        "password",
        "telefone",
        "dataNascimento",
        "perfil",
      ];

      fields.forEach((field) => {
        if (formData.has(field)) {
          data[field] = formData.get(field);
        }
      });

      // Processar upload de foto (opcional)
      const fotoFile = formData.get("foto") as File | null;

      if (fotoFile && fotoFile.size > 0) {
        const validation = validateImageFile(fotoFile);
        if (!validation.valid) {
          return errorResponse(validation.error || "Imagem inválida", 400);
        }

        fotoPath = await saveUploadedFile(fotoFile, "usuarios");
      }

      validatedData = createUserSchema.parse(data);
    } else {
      // Validar dados JSON
      validatedData = await validateRequest(request, createUserSchema);
    }

    // Validar email único
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return errorResponse("Email já cadastrado", 400);
    }

    // Hash da senha
    const hashedPassword = await hashPassword(validatedData.password);

    // Criar usuário e conta de autenticação em uma transação
    const user = await prisma.$transaction(async (tx) => {
      // Criar usuário
      const newUser = await tx.user.create({
        data: {
          nome: validatedData.nome,
          sobrenome: validatedData.sobrenome,
          email: validatedData.email,
          password: hashedPassword,
          telefone: validatedData.telefone,
          dataNascimento: validatedData.dataNascimento,
          perfil: validatedData.perfil,
          foto: fotoPath,
        },
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

      // Criar conta de autenticação (Account) para Better Auth
      await tx.account.create({
        data: {
          userId: newUser.id,
          accountId: newUser.id,
          providerId: "credential",
          password: hashedPassword,
        },
      });

      return newUser;
    });

    return successResponse(user, 201, "Usuário criado com sucesso");
  } catch (error) {
    return handleApiError(error);
  }
}

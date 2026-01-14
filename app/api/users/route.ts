import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { createUserSchema } from '@/lib/validations/user.schema';
import { validateRequest } from '@/lib/middleware/validation';
import { successResponse, errorResponse, handleApiError } from '@/lib/utils/api-response';
import { hashPassword } from '@/lib/utils/password';

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
        createdAt: true,
        updatedAt: true,
        // Não retorna password por segurança
      },
      orderBy: {
        createdAt: 'desc',
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
    // Validar dados de entrada com Zod
    const validatedData = await validateRequest(request, createUserSchema);
    
    // Validar email único
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return errorResponse('Email já cadastrado', 400);
    }

    // Hash da senha
    const hashedPassword = await hashPassword(validatedData.password);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        nome: validatedData.nome,
        sobrenome: validatedData.sobrenome,
        email: validatedData.email,
        password: hashedPassword,
        telefone: validatedData.telefone,
        dataNascimento: validatedData.dataNascimento,
        perfil: validatedData.perfil,
      },
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

    return successResponse(user, 201, 'Usuário criado com sucesso');
  } catch (error) {
    return handleApiError(error);
  }
}

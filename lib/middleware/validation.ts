import { NextRequest } from 'next/server';
import { z, ZodSchema } from 'zod';

/**
 * Middleware para validar corpo da requisição com schema Zod
 */
export async function validateRequest<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): Promise<T> {
  const body = await request.json();
  return schema.parse(body);
}

/**
 * Middleware para validar parâmetros da URL
 */
export function validateParams<T>(
  params: unknown,
  schema: ZodSchema<T>
): T {
  return schema.parse(params);
}

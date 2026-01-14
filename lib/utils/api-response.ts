/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export interface ApiError {
  error: string;
  details?: Record<string, string[]>;
}

export interface ApiSuccess<T = any> {
  data: T;
  message?: string;
}

/**
 * Retorna uma resposta de sucesso padronizada
 */
export function successResponse<T>(
  data: T,
  status: number = 200,
  message?: string
) {
  const response: ApiSuccess<T> = { data };
  if (message) response.message = message;

  return NextResponse.json(response, { status });
}

/**
 * Retorna uma resposta de erro padronizada
 */
export function errorResponse(
  error: string,
  status: number = 400,
  details?: Record<string, string[]>
) {
  const response: ApiError = { error };
  if (details) response.details = details;

  return NextResponse.json(response, { status });
}

/**
 * Trata erros de validação do Zod
 */
export function handleZodError(error: ZodError) {
  const details: Record<string, string[]> = {};

  error.issues.forEach((err) => {
    const path = err.path.join(".");
    if (!details[path]) {
      details[path] = [];
    }
    details[path].push(err.message);
  });

  return errorResponse("Erro de validação", 400, details);
}

/**
 * Handler genérico para erros
 */
export function handleApiError(error: unknown) {
  console.error("API Error:", error);

  if (error instanceof ZodError) {
    return handleZodError(error);
  }

  if (error instanceof Error) {
    return errorResponse(error.message, 500);
  }

  return errorResponse("Erro interno do servidor", 500);
}

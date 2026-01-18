import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

/**
 * Salva um arquivo enviado via FormData no servidor
 * @param file - Arquivo do tipo File
 * @param folder - Pasta de destino (ex: "eventos", "usuarios")
 * @returns Path relativo do arquivo salvo ou null se houver erro
 */
export async function saveUploadedFile(
  file: File,
  folder: string
): Promise<string | null> {
  try {
    // Criar diretório public/uploads se não existir
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Gerar nome único para o arquivo
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = path.extname(file.name);
    const fileName = `${timestamp}-${randomString}${extension}`;

    // Converter File para Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Salvar arquivo
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    // Retornar path relativo para uso no frontend
    return `/uploads/${folder}/${fileName}`;
  } catch (error) {
    console.error("Erro ao salvar arquivo:", error);
    return null;
  }
}

/**
 * Valida se o arquivo é uma imagem válida
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Tipo de arquivo inválido. Use JPEG, PNG ou WebP",
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: "Arquivo muito grande. Tamanho máximo: 5MB",
    };
  }

  return { valid: true };
}

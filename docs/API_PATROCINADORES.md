# API de Patrocinadores

API para gerenciar patrocinadores do podcast Fala Operador.

## Modelo de Dados

```typescript
interface Patrocinador {
  id: string;
  nomeEmpresa: string;
  links: string[];      // Array de URLs
  telefone?: string;
  email?: string;
  endereco?: string;
  imagem: string;       // Caminho da imagem
  createdAt: string;
  updatedAt: string;
}
```

## Endpoints

### 1. Listar Patrocinadores

```http
GET /api/patrocinadores
```

**Autenticação:** Não requerida (Acesso público)

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "nomeEmpresa": "Empresa XYZ",
      "links": [
        "https://empresa.com",
        "https://instagram.com/empresa"
      ],
      "telefone": "(11) 99999-9999",
      "email": "contato@empresa.com",
      "endereco": "Rua Exemplo, 123 - São Paulo/SP",
      "imagem": "/uploads/patrocinadores/patrocinador-123456.jpg",
      "createdAt": "2026-01-20T12:00:00.000Z",
      "updatedAt": "2026-01-20T12:00:00.000Z"
    }
  ]
}
```

---

### 2. Buscar Patrocinador por ID

```http
GET /api/patrocinadores/:id
```

**Autenticação:** Não requerida (Acesso público)

**Parâmetros de URL:**
- `id` - UUID do patrocinador

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "nomeEmpresa": "Empresa XYZ",
    "links": ["https://empresa.com"],
    "telefone": "(11) 99999-9999",
    "email": "contato@empresa.com",
    "endereco": "Rua Exemplo, 123 - São Paulo/SP",
    "imagem": "/uploads/patrocinadores/patrocinador-123456.jpg",
    "createdAt": "2026-01-20T12:00:00.000Z",
    "updatedAt": "2026-01-20T12:00:00.000Z"
  }
}
```

**Resposta de Erro (404):**
```json
{
  "success": false,
  "error": "Patrocinador não encontrado"
}
```

---

### 3. Criar Patrocinador

```http
POST /api/patrocinadores
```

**Autenticação:** Requerida (ADMIN)

**Content-Type:** `multipart/form-data`

**Body (FormData):**
```typescript
{
  nomeEmpresa: string;        // Obrigatório
  links: string;              // JSON array de URLs (opcional)
  telefone?: string;
  email?: string;
  endereco?: string;
  imagem: File;               // Obrigatório (jpg, jpeg, png, webp - max 5MB)
}
```

**Exemplo com Fetch:**
```javascript
const formData = new FormData();
formData.append('nomeEmpresa', 'Empresa XYZ');
formData.append('links', JSON.stringify([
  'https://empresa.com',
  'https://instagram.com/empresa'
]));
formData.append('telefone', '(11) 99999-9999');
formData.append('email', 'contato@empresa.com');
formData.append('endereco', 'Rua Exemplo, 123');
formData.append('imagem', imageFile);

const response = await fetch('/api/patrocinadores', {
  method: 'POST',
  body: formData
});
```

**Resposta de Sucesso (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "nomeEmpresa": "Empresa XYZ",
    "links": ["https://empresa.com"],
    "telefone": "(11) 99999-9999",
    "email": "contato@empresa.com",
    "endereco": "Rua Exemplo, 123",
    "imagem": "/uploads/patrocinadores/patrocinador-123456.jpg",
    "createdAt": "2026-01-20T12:00:00.000Z",
    "updatedAt": "2026-01-20T12:00:00.000Z"
  }
}
```

**Resposta de Erro (400):**
```json
{
  "success": false,
  "error": "Imagem é obrigatória"
}
```

**Resposta de Erro (401):**
```json
{
  "success": false,
  "error": "Não autenticado"
}
```

**Resposta de Erro (403):**
```json
{
  "success": false,
  "error": "Sem permissão para criar patrocinadores"
}
```

---

### 4. Atualizar Patrocinador

```http
PUT /api/patrocinadores/:id
```

**Autenticação:** Requerida (ADMIN)

**Content-Type:** `multipart/form-data`

**Parâmetros de URL:**
- `id` - UUID do patrocinador

**Body (FormData):**
```typescript
{
  nomeEmpresa?: string;
  links?: string;             // JSON array de URLs
  telefone?: string;
  email?: string;
  endereco?: string;
  imagem?: File;              // Nova imagem (opcional)
}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "nomeEmpresa": "Empresa XYZ Atualizada",
    "links": ["https://empresa.com"],
    "telefone": "(11) 98888-8888",
    "email": "novo@empresa.com",
    "endereco": "Novo Endereço",
    "imagem": "/uploads/patrocinadores/patrocinador-654321.jpg",
    "createdAt": "2026-01-20T12:00:00.000Z",
    "updatedAt": "2026-01-20T13:00:00.000Z"
  }
}
```

**Resposta de Erro (404):**
```json
{
  "success": false,
  "error": "Patrocinador não encontrado"
}
```

---

### 5. Deletar Patrocinador

```http
DELETE /api/patrocinadores/:id
```

**Autenticação:** Requerida (ADMIN)

**Parâmetros de URL:**
- `id` - UUID do patrocinador

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "message": "Patrocinador deletado com sucesso"
  }
}
```

**Resposta de Erro (404):**
```json
{
  "success": false,
  "error": "Patrocinador não encontrado"
}
```

---

## Validações

### Nome da Empresa
- ✓ Obrigatório
- ✓ Mínimo 1 caractere
- ✓ Máximo 255 caracteres

### Links
- ✓ Array de URLs válidas
- ✓ Opcional (padrão: array vazio)

### Email
- ✓ Formato de email válido
- ✓ Opcional

### Imagem
- ✓ Obrigatória na criação
- ✓ Formatos aceitos: jpg, jpeg, png, webp
- ✓ Tamanho máximo: 5MB
- ✓ A imagem antiga é deletada ao atualizar

---

## Diretório de Upload

As imagens são salvas em:
```
public/uploads/patrocinadores/
```

Formato do nome do arquivo:
```
patrocinador-{timestamp}.{extensão}
```

---

## Permissões

| Ação | Público | Usuário | Admin |
|------|---------|---------|-------|
| Listar (GET) | ✓ | ✓ | ✓ |
| Buscar por ID (GET) | ✓ | ✓ | ✓ |
| Criar (POST) | ✗ | ✗ | ✓ |
| Atualizar (PUT) | ✗ | ✗ | ✓ |
| Deletar (DELETE) | ✗ | ✗ | ✓ |

---

## Exemplos de Uso

### React/Next.js - Listar Patrocinadores

```typescript
async function fetchPatrocinadores() {
  const response = await fetch('/api/patrocinadores');
  const result = await response.json();
  
  if (result.success) {
    return result.data;
  }
  
  throw new Error(result.error);
}
```

### React/Next.js - Criar Patrocinador

```typescript
async function createPatrocinador(data: {
  nomeEmpresa: string;
  links: string[];
  telefone?: string;
  email?: string;
  endereco?: string;
  imagem: File;
}) {
  const formData = new FormData();
  
  formData.append('nomeEmpresa', data.nomeEmpresa);
  formData.append('links', JSON.stringify(data.links));
  
  if (data.telefone) formData.append('telefone', data.telefone);
  if (data.email) formData.append('email', data.email);
  if (data.endereco) formData.append('endereco', data.endereco);
  
  formData.append('imagem', data.imagem);
  
  const response = await fetch('/api/patrocinadores', {
    method: 'POST',
    body: formData,
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.error);
  }
  
  return result.data;
}
```

---

## Notas Importantes

1. **Acesso Público**: A listagem e visualização de patrocinadores é pública (não requer autenticação)
2. **Apenas Admins**: Apenas usuários com perfil `ADMIN` podem criar, atualizar ou deletar patrocinadores
3. **Upload de Imagens**: Use FormData para enviar imagens
4. **Links**: Os links são armazenados como JSON no banco e parseados automaticamente nas respostas
5. **Limpeza de Arquivos**: Ao deletar ou atualizar, a imagem antiga é automaticamente removida do servidor

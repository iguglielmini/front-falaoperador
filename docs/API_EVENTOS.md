# 🎉 API de Eventos - Documentação

Documentação completa da API REST de Eventos do Fala Operador.

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Base URL](#-base-url)
- [Autenticação](#-autenticação)
- [Endpoints](#-endpoints)
- [Schemas](#-schemas)
- [Upload de Imagens](#-upload-de-imagens)
- [Geolocalização](#-geolocalização)
- [Exemplos de Uso](#-exemplos-de-uso)
- [Códigos de Status](#-códigos-de-status)
- [Tratamento de Erros](#-tratamento-de-erros)

---

## 🎯 Visão Geral

A API de Eventos permite gerenciar eventos completos com:

- ✅ Upload de imagens
- ✅ Geolocalização automática via Google Maps
- ✅ Sistema de participantes
- ✅ Controle de visibilidade (pública/privada)
- ✅ Categorias (Podcast, Evento, Entrevista, Live, Outro)
- ✅ Integração com YouTube
- ✅ Permissões por perfil (ADMIN/USUARIO)

---

## 🌐 Base URL

```
http://localhost:3000/api
```

---

## 🔐 Autenticação

Todos os endpoints requerem autenticação via **Better Auth**.

**Headers obrigatórios:**
```http
Authorization: Bearer <seu-token>
```

**Permissões:**
- **USUARIO**: Pode criar eventos, ver públicos e eventos que participa
- **ADMIN**: Pode ver, editar e excluir todos os eventos

---

## 📡 Endpoints

### 1️⃣ Listar Eventos

```http
GET /api/eventos
```

**Descrição**: Retorna lista de eventos baseada no perfil do usuário.

**Resposta de Sucesso** (200):
```json
{
  "data": [
    {
      "id": "uuid",
      "titulo": "Podcast: Tecnologia e Inovação",
      "descricao": "Discussão sobre tendências tech",
      "imagem": "/uploads/eventos/evento_123.jpg",
      "endereco": "Av. Paulista",
      "numero": "1000",
      "cep": "01310-100",
      "latitude": -23.561684,
      "longitude": -46.655981,
      "dataInicio": "2026-02-01T19:00:00.000Z",
      "dataFim": "2026-02-01T22:00:00.000Z",
      "criadorId": "uuid",
      "criador": {
        "id": "uuid",
        "nome": "João",
        "sobrenome": "Silva",
        "email": "joao@example.com"
      },
      "visibilidade": "PUBLICA",
      "categoria": "PODCAST",
      "linkYoutube": "https://youtube.com/watch?v=abc123",
      "participantes": [
        {
          "id": "uuid",
          "eventoId": "uuid",
          "userId": "uuid",
          "user": {
            "id": "uuid",
            "nome": "Maria",
            "sobrenome": "Santos",
            "email": "maria@example.com"
          },
          "createdAt": "2026-01-18T10:00:00.000Z"
        }
      ],
      "createdAt": "2026-01-18T10:00:00.000Z",
      "updatedAt": "2026-01-18T10:00:00.000Z"
    }
  ]
}
```

**Regras de Visibilidade:**
- **USUARIO**: Vê eventos públicos + eventos que criou + eventos que participa
- **ADMIN**: Vê todos os eventos

---

### 2️⃣ Criar Evento

```http
POST /api/eventos
Content-Type: multipart/form-data
```

**Descrição**: Cria um novo evento com upload de imagem e geolocalização automática.

**Body (FormData)**:
```javascript
{
  titulo: "Podcast: Tecnologia e Inovação",           // Obrigatório (3-100 chars)
  descricao: "Discussão sobre tendências...",         // Opcional (max 1000 chars)
  imagem: File,                                       // Opcional (JPEG/PNG/WebP, max 5MB)
  endereco: "Av. Paulista",                          // Obrigatório (min 5 chars)
  numero: "1000",                                     // Obrigatório
  cep: "01310-100",                                   // Obrigatório (formato: 00000-000)
  dataInicio: "2026-02-01T19:00:00Z",                // Obrigatório (ISO 8601)
  dataFim: "2026-02-01T22:00:00Z",                   // Obrigatório (ISO 8601, deve ser > dataInicio)
  visibilidade: "PUBLICA",                            // Opcional (default: PUBLICA)
  categoria: "PODCAST",                               // Opcional (default: EVENTO)
  linkYoutube: "https://youtube.com/watch?v=abc",    // Opcional (URL válida)
  participantes: '["uuid1", "uuid2"]'                // Opcional (JSON array de UUIDs)
}
```

**Resposta de Sucesso** (201):
```json
{
  "data": {
    "id": "uuid",
    "titulo": "Podcast: Tecnologia e Inovação",
    "latitude": -23.561684,
    "longitude": -46.655981,
    // ... demais campos
  },
  "message": "Evento criado com sucesso"
}
```

**Erros:**
- `400`: Validação falhou
- `401`: Não autenticado

---

### 3️⃣ Buscar Evento por ID

```http
GET /api/eventos/{id}
```

**Parâmetros:**
- `id` (path): UUID do evento

**Resposta de Sucesso** (200):
```json
{
  "data": {
    "id": "uuid",
    "titulo": "Podcast: Tecnologia e Inovação",
    // ... todos os campos incluindo criador e participantes
  }
}
```

**Permissões:**
- Evento público: qualquer usuário autenticado
- Evento privado: apenas criador, participantes ou admin

**Erros:**
- `401`: Não autenticado
- `403`: Sem permissão para visualizar
- `404`: Evento não encontrado

---

### 4️⃣ Atualizar Evento

```http
PUT /api/eventos/{id}
Content-Type: multipart/form-data
```

**Descrição**: Atualiza um evento existente (apenas criador ou admin).

**Body (FormData)** - Todos os campos são opcionais:
```javascript
{
  titulo: "Novo Título",
  descricao: "Nova descrição",
  imagem: File,                    // Nova imagem (substitui a anterior)
  endereco: "Novo endereço",
  numero: "2000",
  cep: "01310-200",
  dataInicio: "2026-02-02T19:00:00Z",
  dataFim: "2026-02-02T22:00:00Z",
  visibilidade: "PRIVADA",
  categoria: "LIVE",
  linkYoutube: "https://youtube.com/watch?v=xyz",
  participantes: '["uuid3", "uuid4"]'  // Substitui lista anterior
}
```

**Resposta de Sucesso** (200):
```json
{
  "data": {
    "id": "uuid",
    // ... campos atualizados
  },
  "message": "Evento atualizado com sucesso"
}
```

**Permissões:**
- Apenas criador do evento ou admin podem atualizar

**Erros:**
- `400`: Validação falhou
- `401`: Não autenticado
- `403`: Sem permissão para editar
- `404`: Evento não encontrado

---

### 5️⃣ Excluir Evento

```http
DELETE /api/eventos/{id}
```

**Descrição**: Remove um evento do sistema (apenas criador ou admin).

**Resposta de Sucesso** (200):
```json
{
  "data": null,
  "message": "Evento excluído com sucesso"
}
```

**Permissões:**
- Apenas criador do evento ou admin podem excluir

**Efeitos Cascata:**
- Remove automaticamente todos os participantes associados

**Erros:**
- `401`: Não autenticado
- `403`: Sem permissão para excluir
- `404`: Evento não encontrado

---

## 📦 Schemas

### Enums

#### CategoriaEvento
```typescript
enum CategoriaEvento {
  PODCAST      // Episódios de podcast
  EVENTO       // Eventos presenciais gerais
  ENTREVISTA   // Entrevistas
  LIVE         // Transmissões ao vivo
  OUTRO        // Outros tipos
}
```

#### VisibilidadeEvento
```typescript
enum VisibilidadeEvento {
  PUBLICA   // Visível para todos os usuários
  PRIVADA   // Visível apenas para criador, participantes e admins
}
```

### Modelo Evento

```typescript
interface Evento {
  id: string;                      // UUID único
  titulo: string;                  // 3-100 caracteres
  descricao?: string | null;       // 0-1000 caracteres
  imagem?: string | null;          // Caminho do arquivo
  endereco: string;                // Endereço completo
  numero: string;                  // Número do imóvel
  cep: string;                     // Formato: 00000-000
  latitude?: number | null;        // Gerado automaticamente
  longitude?: number | null;       // Gerado automaticamente
  dataInicio: Date;                // ISO 8601
  dataFim: Date;                   // ISO 8601 (deve ser > dataInicio)
  criadorId: string;               // UUID do criador
  criador: User;                   // Dados do usuário criador
  visibilidade: VisibilidadeEvento; // Padrão: PUBLICA
  categoria: CategoriaEvento;      // Padrão: EVENTO
  linkYoutube?: string | null;     // URL completa do YouTube
  participantes: EventoParticipante[]; // Array de participantes
  createdAt: Date;                 // Data de criação
  updatedAt: Date;                 // Data de atualização
}
```

### Modelo EventoParticipante

```typescript
interface EventoParticipante {
  id: string;           // UUID único
  eventoId: string;     // UUID do evento
  userId: string;       // UUID do usuário participante
  evento: Evento;       // Relação com evento
  user: User;           // Dados do usuário
  createdAt: Date;      // Data de adição
}
```

---

## 🖼️ Upload de Imagens

### Especificações

**Formatos aceitos:**
- JPEG (image/jpeg)
- PNG (image/png)
- WebP (image/webp)

**Tamanho máximo:** 5MB

**Diretório de armazenamento:**
```
public/uploads/eventos/
```

**Formato do nome:**
```
evento_{timestamp}_{random}.{ext}
```

### Validação

O sistema valida automaticamente:
- Tipo MIME do arquivo
- Tamanho do arquivo
- Extensão do arquivo

**Erro de validação:**
```json
{
  "error": "Imagem inválida. Formatos aceitos: JPEG, PNG, WebP. Tamanho máximo: 5MB"
}
```

### Acesso às Imagens

As imagens são servidas estaticamente:
```
http://localhost:3000/uploads/eventos/evento_1234567890_abc.jpg
```

---

## 🗺️ Geolocalização

### Google Maps Geocoding API

O sistema converte automaticamente endereço + número + CEP em coordenadas geográficas.

**Configuração:**

1. Obtenha uma API Key do Google Maps:
   - [Google Cloud Console](https://console.cloud.google.com/)
   - Ative a Geocoding API

2. Configure no `.env`:
```env
GOOGLE_MAPS_API_KEY=sua-chave-aqui
```

**Comportamento:**

- ✅ **Com API Key**: Coordenadas são geradas automaticamente
- ⚠️ **Sem API Key**: Evento é criado com `latitude` e `longitude` como `null`

**Campos gerados:**
```json
{
  "latitude": -23.561684,
  "longitude": -46.655981
}
```

**Nota**: A ausência de geolocalização não impede a criação do evento.

---

## 💡 Exemplos de Uso

### Criar Evento com JavaScript

```javascript
const formData = new FormData();

formData.append('titulo', 'Podcast: Tech do Futuro');
formData.append('descricao', 'Explorando as tendências tecnológicas');
formData.append('endereco', 'Av. Paulista');
formData.append('numero', '1000');
formData.append('cep', '01310-100');
formData.append('dataInicio', '2026-03-15T19:00:00Z');
formData.append('dataFim', '2026-03-15T21:00:00Z');
formData.append('visibilidade', 'PUBLICA');
formData.append('categoria', 'PODCAST');
formData.append('linkYoutube', 'https://youtube.com/watch?v=xyz');

// Upload de imagem
const imageFile = document.querySelector('#image-input').files[0];
if (imageFile) {
  formData.append('imagem', imageFile);
}

// Adicionar participantes
const participantesIds = ['uuid1', 'uuid2', 'uuid3'];
formData.append('participantes', JSON.stringify(participantesIds));

// Enviar requisição
const response = await fetch('/api/eventos', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
  body: formData,
});

const result = await response.json();
console.log(result);
```

### Atualizar Evento

```javascript
const formData = new FormData();

// Atualizar apenas título e categoria
formData.append('titulo', 'Novo Título do Evento');
formData.append('categoria', 'LIVE');

const response = await fetch(`/api/eventos/${eventoId}`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
  body: formData,
});

const result = await response.json();
```

### Listar Eventos

```javascript
const response = await fetch('/api/eventos', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});

const { data: eventos } = await response.json();

eventos.forEach(evento => {
  console.log(`${evento.titulo} - ${evento.categoria}`);
  console.log(`Local: ${evento.endereco}, ${evento.numero}`);
  console.log(`Participantes: ${evento.participantes.length}`);
});
```

### Excluir Evento

```javascript
const response = await fetch(`/api/eventos/${eventoId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});

if (response.ok) {
  console.log('Evento excluído com sucesso');
}
```

---

## 📊 Códigos de Status

| Código | Significado |
|--------|-------------|
| `200` | Sucesso (GET, PUT, DELETE) |
| `201` | Criado com sucesso (POST) |
| `400` | Erro de validação nos dados enviados |
| `401` | Não autenticado (token ausente ou inválido) |
| `403` | Sem permissão para realizar ação |
| `404` | Evento não encontrado |
| `500` | Erro interno do servidor |

---

## ⚠️ Tratamento de Erros

### Erro de Validação (400)

```json
{
  "error": "Erro de validação",
  "details": {
    "titulo": ["Título deve ter no mínimo 3 caracteres"],
    "dataFim": ["Data de fim deve ser posterior à data de início"]
  }
}
```

### Erro de Autenticação (401)

```json
{
  "error": "Não autenticado"
}
```

### Erro de Permissão (403)

```json
{
  "error": "Sem permissão para editar este evento"
}
```

### Evento Não Encontrado (404)

```json
{
  "error": "Evento não encontrado"
}
```

### Erro de Upload (400)

```json
{
  "error": "Imagem inválida. Formatos aceitos: JPEG, PNG, WebP. Tamanho máximo: 5MB"
}
```

---

## 🔗 Links Relacionados

- [API de Usuários](./API_USERS.md)
- [API de Tarefas](./API_TAREFAS.md)
- [Guia de Setup](./SETUP.md)
- [Swagger Interativo](http://localhost:3000/api-docs)

---

## 📝 Notas Importantes

1. **Datas**: Sempre use formato ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)
2. **Participantes**: O array `participantes` no FormData deve ser uma string JSON
3. **Imagens**: Ao atualizar, nova imagem substitui a anterior (não há append)
4. **Geolocalização**: É opcional - evento funciona sem coordenadas
5. **Cascata**: Excluir evento remove automaticamente participantes

---

## 🆘 Dúvidas?

- Consulte o [Swagger interativo](http://localhost:3000/api-docs) para testar endpoints
- Veja exemplos práticos no código do projeto
- Abra uma issue no GitHub para suporte

---

[← Voltar ao Índice da Documentação](./README.md)

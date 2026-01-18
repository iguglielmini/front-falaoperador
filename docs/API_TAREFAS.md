# ✅ API de Tarefas - Documentação

Documentação completa da API REST de Tarefas do Fala Operador.

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Base URL](#-base-url)
- [Autenticação](#-autenticação)
- [Endpoints](#-endpoints)
- [Schemas](#-schemas)
- [Exemplos de Uso](#-exemplos-de-uso)
- [Códigos de Status](#-códigos-de-status)
- [Tratamento de Erros](#-tratamento-de-erros)

---

## 🎯 Visão Geral

A API de Tarefas permite gerenciar tarefas completas com:

- ✅ CRUD completo
- ✅ Status e prioridades
- ✅ Tarefas públicas e privadas
- ✅ Datas de início e fim
- ✅ Filtros por título, status e data
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
- **USUARIO**: Pode criar tarefas, ver públicas e suas próprias
- **ADMIN**: Pode ver, editar e excluir todas as tarefas

---

## 📡 Endpoints

### 1️⃣ Listar Tarefas

```http
GET /api/tarefas
```

**Descrição**: Retorna lista de tarefas baseada no perfil do usuário.

**Resposta de Sucesso** (200):
```json
{
  "data": [
    {
      "id": "uuid",
      "titulo": "Implementar nova feature",
      "descricao": "Adicionar sistema de notificações",
      "status": "EM_PROGRESSO",
      "prioridade": "ALTA",
      "publica": false,
      "dataInicio": "2026-01-20T00:00:00.000Z",
      "dataFim": "2026-01-31T00:00:00.000Z",
      "userId": "uuid",
      "user": {
        "id": "uuid",
        "nome": "João",
        "sobrenome": "Silva",
        "email": "joao@example.com"
      },
      "createdAt": "2026-01-18T10:00:00.000Z",
      "updatedAt": "2026-01-18T10:00:00.000Z"
    }
  ]
}
```

**Regras de Visibilidade:**
- **USUARIO**: Vê tarefas públicas + suas próprias tarefas
- **ADMIN**: Vê todas as tarefas

---

### 2️⃣ Criar Tarefa

```http
POST /api/tarefas
Content-Type: application/json
```

**Body**:
```json
{
  "titulo": "Implementar nova feature",              // Obrigatório (3-100 chars)
  "descricao": "Adicionar sistema de notificações", // Opcional (max 500 chars)
  "status": "PENDENTE",                             // Opcional (default: PENDENTE)
  "prioridade": "ALTA",                             // Opcional (default: MEDIA)
  "publica": false,                                 // Opcional (default: false)
  "dataInicio": "2026-01-20",                       // Opcional (YYYY-MM-DD)
  "dataFim": "2026-01-31"                          // Opcional (YYYY-MM-DD)
}
```

**Resposta de Sucesso** (201):
```json
{
  "data": {
    "id": "uuid",
    "titulo": "Implementar nova feature",
    "status": "PENDENTE",
    "prioridade": "ALTA",
    // ... demais campos
  },
  "message": "Tarefa criada com sucesso"
}
```

---

### 3️⃣ Buscar Tarefa por ID

```http
GET /api/tarefas/{id}
```

**Permissões:**
- Tarefa pública: qualquer usuário autenticado
- Tarefa privada: apenas dono ou admin

**Resposta de Sucesso** (200):
```json
{
  "data": {
    "id": "uuid",
    "titulo": "Implementar nova feature",
    // ... todos os campos incluindo user
  }
}
```

---

### 4️⃣ Atualizar Tarefa

```http
PUT /api/tarefas/{id}
Content-Type: application/json
```

**Body** - Todos os campos são opcionais:
```json
{
  "titulo": "Novo título",
  "descricao": "Nova descrição",
  "status": "CONCLUIDA",
  "prioridade": "URGENTE",
  "publica": true,
  "dataInicio": "2026-01-21",
  "dataFim": "2026-02-01"
}
```

**Permissões:**
- Apenas dono da tarefa ou admin podem atualizar

---

### 5️⃣ Excluir Tarefa

```http
DELETE /api/tarefas/{id}
```

**Permissões:**
- Apenas dono da tarefa ou admin podem excluir

**Resposta de Sucesso** (200):
```json
{
  "data": null,
  "message": "Tarefa excluída com sucesso"
}
```

---

## 📦 Schemas

### Enums

#### StatusTarefa
```typescript
enum StatusTarefa {
  PENDENTE      // Aguardando início
  EM_PROGRESSO  // Em andamento
  CONCLUIDA     // Finalizada
  CANCELADA     // Cancelada
}
```

#### PrioridadeTarefa
```typescript
enum PrioridadeTarefa {
  BAIXA     // Prioridade baixa
  MEDIA     // Prioridade média (padrão)
  ALTA      // Prioridade alta
  URGENTE   // Prioridade urgente
}
```

### Modelo Tarefa

```typescript
interface Tarefa {
  id: string;                    // UUID único
  titulo: string;                // 3-100 caracteres
  descricao?: string | null;     // 0-500 caracteres
  status: StatusTarefa;          // Padrão: PENDENTE
  prioridade: PrioridadeTarefa;  // Padrão: MEDIA
  publica: boolean;              // Padrão: false
  dataInicio?: Date | null;      // Data de início
  dataFim?: Date | null;         // Data de término
  userId: string;                // UUID do criador
  user: User;                    // Dados do usuário
  createdAt: Date;               // Data de criação
  updatedAt: Date;               // Data de atualização
}
```

---

## 💡 Exemplos de Uso

### Criar Tarefa

```javascript
const response = await fetch('/api/tarefas', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    titulo: 'Implementar dashboard',
    descricao: 'Criar dashboard com gráficos',
    status: 'EM_PROGRESSO',
    prioridade: 'ALTA',
    publica: true,
    dataInicio: '2026-02-01',
    dataFim: '2026-02-15'
  }),
});

const result = await response.json();
```

### Listar e Filtrar Tarefas

```javascript
const response = await fetch('/api/tarefas', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});

const { data: tarefas } = await response.json();

// Filtrar localmente por status
const pendentes = tarefas.filter(t => t.status === 'PENDENTE');
const urgentes = tarefas.filter(t => t.prioridade === 'URGENTE');
```

---

## 📊 Códigos de Status

| Código | Significado |
|--------|-------------|
| `200` | Sucesso (GET, PUT, DELETE) |
| `201` | Criado com sucesso (POST) |
| `400` | Erro de validação |
| `401` | Não autenticado |
| `403` | Sem permissão |
| `404` | Tarefa não encontrada |
| `500` | Erro interno |

---

## 🔗 Links Relacionados

- [API de Usuários](./API_USERS.md)
- [API de Eventos](./API_EVENTOS.md)
- [Swagger Interativo](http://localhost:3000/api-docs)

---

[← Voltar ao Índice da Documentação](./README.md)

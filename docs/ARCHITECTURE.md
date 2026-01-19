# 🏗️ Arquitetura do Projeto

Documentação sobre decisões arquiteturais e padrões adotados no projeto Fala Operador.

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Padrões Adotados](#-padrões-adotados)
- [Context API](#-context-api---gerenciamento-de-estado)
- [Componentização](#-componentização)
- [API Routes](#-api-routes)
- [Validação de Dados](#-validação-de-dados)
- [Banco de Dados](#-banco-de-dados)
- [Decisões Técnicas](#-decisões-técnicas)

---

## 🎯 Visão Geral

O projeto segue uma arquitetura **modular** e **escalável** baseada em:

- **Next.js App Router** para roteamento e SSR
- **React Server Components** para performance
- **Context API** para gerenciamento de estado global
- **Prisma ORM** para abstração do banco de dados
- **Zod** para validação type-safe
- **Better Auth** para autenticação

---

## 📁 Estrutura de Pastas

```
front-falaoperador/
├── app/                      # Next.js App Router
│   ├── api/                 # API Routes (backend)
│   │   ├── eventos/        # Endpoints de eventos
│   │   ├── tarefas/        # Endpoints de tarefas
│   │   └── users/          # Endpoints de usuários
│   ├── dashboard/          # Páginas autenticadas
│   │   ├── configuracao/   # Página de perfil
│   │   ├── eventos/        # Página de eventos
│   │   ├── tarefas/        # Página de tarefas
│   │   └── usuarios/       # Página de usuários (admin)
│   ├── login/              # Página de login
│   ├── register/           # Página de registro
│   ├── layout.tsx          # Layout global
│   └── page.tsx            # Página inicial
│
├── components/              # Componentes React
│   ├── auth/               # Componentes de autenticação
│   ├── eventos/            # Componentes de eventos
│   ├── layout/             # Componentes de layout
│   ├── shared/             # Componentes compartilhados
│   ├── tarefas/            # Componentes de tarefas
│   ├── ui/                 # Componentes base (Radix UI)
│   └── users/              # Componentes de usuários
│
├── contexts/                # Context API (estado global)
│   ├── TarefasContext.tsx  # Estado de tarefas
│   └── UserContext.tsx     # Estado do usuário
│
├── lib/                     # Bibliotecas e utilitários
│   ├── auth.ts             # Configuração Better Auth
│   ├── auth-client.ts      # Cliente de autenticação
│   ├── prisma.ts           # Cliente Prisma
│   ├── utils.ts            # Utilitários gerais
│   ├── middleware/         # Middlewares
│   ├── swagger/            # Configuração Swagger
│   ├── utils/              # Utilitários específicos
│   └── validations/        # Schemas Zod
│
├── prisma/                  # Banco de dados
│   ├── schema.prisma       # Modelo do banco
│   └── migrations/         # Histórico de migrações
│
├── hooks/                   # Custom React Hooks
│   └── use-mobile.ts       # Hook para detecção mobile
│
└── docs/                    # Documentação
    ├── README.md           # Índice da documentação
    ├── SETUP.md            # Guia de setup
    ├── ARCHITECTURE.md     # Este documento
    ├── API_USERS.md        # API de usuários
    ├── API_TAREFAS.md      # API de tarefas
    └── API_EVENTOS.md      # API de eventos
```

---

## 🎨 Padrões Adotados

### 1. Separation of Concerns

- **Frontend** (`components/`, `app/`): UI e lógica de apresentação
- **Backend** (`app/api/`): Lógica de negócios e acesso a dados
- **Validação** (`lib/validations/`): Schemas reutilizáveis
- **Utilitários** (`lib/utils/`): Funções helpers

### 2. Component-Based Architecture

Componentes organizados por:
- **Domínio** (eventos, tarefas, users)
- **Tipo** (modais, tabelas, formulários)
- **Reusabilidade** (shared, ui)

### 3. API Routes RESTful

Seguem convenções REST:
```
GET    /api/eventos      # Listar
POST   /api/eventos      # Criar
GET    /api/eventos/:id  # Buscar um
PUT    /api/eventos/:id  # Atualizar
DELETE /api/eventos/:id  # Excluir
```

---

## 🔄 Context API - Gerenciamento de Estado

### Por que Context API?

❌ **Antes (Prop Drilling)**:
```
Page → Modal → Form → Input
      ↓       ↓      ↓
   props  props  props  (repetição, difícil de manter)
```

✅ **Depois (Context API)**:
```
Provider (estado + funções)
    ↓
Qualquer componente consome diretamente
(menos código, mais manutenível)
```

### Vantagens da Context API

1. **🎯 Centralização**
   - Estado e lógica em um único lugar
   - Fácil de encontrar e modificar

2. **🔄 Reusabilidade**
   - Funções CRUD disponíveis em toda a árvore
   - Sem duplicação de código

3. **📦 Separação de Responsabilidades**
   - Context = lógica de dados
   - Components = UI e interação

4. **⚡ Performance**
   - Re-renders otimizados
   - Apenas componentes que usam o contexto atualizam

5. **🧪 Testabilidade**
   - Lógica isolada do componente
   - Fácil de mockar em testes

### Estrutura dos Contexts

#### TarefasContext

```typescript
// contexts/TarefasContext.tsx

interface TarefasContextType {
  tarefas: Tarefa[];                    // Estado
  isLoading: boolean;                   // Loading state
  fetchTarefas: () => Promise<void>;    // Listar
  createTarefa: (data) => Promise<void>; // Criar
  updateTarefa: (id, data) => Promise<void>; // Atualizar
  deleteTarefa: (id) => Promise<void>;  // Excluir
  getTarefaById: (id) => Tarefa | undefined; // Buscar uma
}

// Uso nos componentes
const { tarefas, createTarefa, updateTarefa } = useTarefas();
```

**Benefícios:**
- ✅ Componentes não fazem fetch direto
- ✅ Cache automático de tarefas
- ✅ Loading state centralizado
- ✅ Tratamento de erros unificado

#### UserContext

```typescript
// contexts/UserContext.tsx

interface UserContextType {
  user: User | null;                    // Estado do usuário
  isLoading: boolean;                   // Loading state
  fetchUser: () => Promise<void>;       // Recarregar dados
  updateUser: (data) => Promise<void>;  // Atualizar perfil
  updatePassword: (data) => Promise<void>; // Alterar senha
}

// Uso nos componentes
const { user, updateUser, updatePassword } = useUser();
```

**Benefícios:**
- ✅ Dados do usuário disponíveis em qualquer página
- ✅ Evita múltiplas requisições ao backend
- ✅ Sincronização automática após updates

### Quando NÃO usar Context

❌ Evite Context API para:
- Estado local de um único componente (use `useState`)
- Dados que não são compartilhados (props são melhores)
- Performance crítica com muitos re-renders (considere Zustand/Redux)

### Boas Práticas

1. **Um Context por domínio**
   - TarefasContext para tarefas
   - UserContext para usuário
   - EventosContext para eventos (futuro)

2. **Custom Hooks**
   - `useTarefas()` em vez de `useContext(TarefasContext)`
   - Melhor DX e type-safety

3. **Provider no nível correto**
   - Layout global: `UserProvider`
   - Layout autenticado: `TarefasProvider`

4. **Carregamento inicial**
   - `fetchTarefas()` no `useEffect` do provider
   - Dados prontos quando componente monta

---

## 🧩 Componentização

### Princípios

1. **Single Responsibility**
   - Cada componente faz uma coisa bem feita

2. **Composição**
   - Componentes pequenos que se combinam

3. **Reusabilidade**
   - Props configuráveis
   - Sem lógica de negócio acoplada

### Exemplos

#### ✅ Bom: Componente Reutilizável

```typescript
// TarefasTable.tsx - recebe dados via props
interface Props {
  tarefas: Tarefa[];
  onDelete: (id: string) => void;
}

export function TarefasTable({ tarefas, onDelete }: Props) {
  // Apenas renderiza, não busca dados
}
```

#### ❌ Ruim: Componente Acoplado

```typescript
// TarefasTable.tsx - busca dados internamente
export function TarefasTable() {
  const [tarefas, setTarefas] = useState([]);
  
  useEffect(() => {
    fetch('/api/tarefas')... // ❌ Acoplamento
  }, []);
}
```

---

## 🛣️ API Routes

### Estrutura Padrão

```typescript
// app/api/eventos/route.ts

export async function GET(request: NextRequest) {
  // 1. Autenticação
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) return errorResponse("Não autenticado", 401);

  // 2. Autorização
  const isAdmin = session.user.perfil === "ADMIN";

  // 3. Lógica de negócio
  const eventos = await prisma.evento.findMany({
    where: isAdmin ? {} : { /* filtros */ },
  });

  // 4. Resposta
  return successResponse(eventos);
}
```

### Padrões de Resposta

```typescript
// lib/utils/api-response.ts

// Sucesso
successResponse(data, status?, message?)

// Erro
errorResponse(message, status)

// Tratamento automático
handleApiError(error)
```

### Validação de Dados

```typescript
// 1. Schema Zod
const schema = z.object({
  titulo: z.string().min(3),
  status: z.enum(['PENDENTE', 'CONCLUIDA']),
});

// 2. Validação
const validatedData = schema.parse(data);

// 3. Uso
await prisma.tarefa.create({ data: validatedData });
```

---

## 🗄️ Banco de Dados

### Prisma ORM

**Por que Prisma?**
- Type-safe: TypeScript automático dos modelos
- Migrations: Controle de versão do schema
- Prisma Studio: Interface visual
- Relações: Facilita joins e includes

### Schema Design

```prisma
model User {
  id       String   @id @default(uuid())
  email    String   @unique
  tarefas  Tarefa[]
  eventos  Evento[] @relation("EventoCriador")
}

model Tarefa {
  id     String @id @default(uuid())
  titulo String
  userId String
  user   User   @relation(fields: [userId], references: [id])
}
```

### Migrations

```bash
# Criar migration
npx prisma migrate dev --name add_eventos

# Aplicar em produção
npx prisma migrate deploy

# Resetar (dev)
npx prisma migrate reset
```

---

## ✅ Validação de Dados

### Zod Schema

**Por que Zod?**
- Type-safe: infere TypeScript automaticamente
- Composável: reutiliza schemas
- Mensagens de erro customizadas
- Validações complexas com `.refine()`

### Exemplo Completo

```typescript
// lib/validations/tarefa.schema.ts

const baseSchema = z.object({
  titulo: z.string().min(3, "Mínimo 3 caracteres"),
  status: z.enum(['PENDENTE', 'CONCLUIDA']),
});

export const createTarefaSchema = baseSchema;
export const updateTarefaSchema = baseSchema.partial();

export type CreateTarefaInput = z.infer<typeof createTarefaSchema>;
```

---

## � Processamento de FormData

### Pattern: Helper Functions

**Problema**: Repetição de código ao extrair dados de `FormData` em rotas com upload de arquivo.

**Solução**: Criar função helper reutilizável no topo do arquivo de rota.

### Exemplo de Implementação

```typescript
// app/api/eventos/route.ts

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

// Uso na rota
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const data = extractEventoDataFromFormData(formData);
  const validatedData = createEventoSchema.parse(data);
  // ...
}
```

### Benefícios

1. **DRY (Don't Repeat Yourself)**
   - Elimina 20+ linhas de if-statements repetitivos
   - Reutilizável entre POST e PUT

2. **Type Safety**
   - Retorno consistente: `Record<string, string | string[] | null>`
   - Array de campos com `as const`

3. **Manutenibilidade**
   - Adicionar novo campo: apenas atualizar array
   - Lógica centralizada em um lugar

4. **Tratamento de Erros**
   - Parse seguro de JSON com try-catch
   - Valores vazios convertidos para `null`

### Quando Usar

✅ **Use helper quando**:
- Endpoint recebe `multipart/form-data`
- 3+ campos precisam ser extraídos
- Mesmo processamento em múltiplas rotas
- Campos com arrays/JSON precisam de parse

❌ **Não use helper quando**:
- Endpoint recebe JSON simples (use `validateRequest`)
- Apenas 1-2 campos simples
- Lógica de extração é única

---

## 🚀 Decisões Técnicas

### 1. Next.js App Router vs Pages Router

✅ **Escolhemos App Router**:
- Server Components (melhor performance)
- Layouts aninhados
- Streaming e Suspense
- Futuro do Next.js

### 2. Context API vs Redux/Zustand

✅ **Escolhemos Context API**:
- Nativo do React
- Suficiente para escala do projeto
- Menos boilerplate
- Integração natural com hooks

### 3. SQLite vs PostgreSQL

✅ **Escolhemos SQLite**:
- Zero configuração (dev)
- Arquivo único (portabilidade)
- Suficiente para MVP
- Fácil migrar para PostgreSQL depois

### 4. Better Auth vs NextAuth

✅ **Escolhemos Better Auth**:
- Type-safe completo
- Moderno e mantido
- Flexível
- Integração Prisma nativa

### 5. Radix UI vs Material UI

✅ **Escolhemos Radix UI**:
- Unstyled (controle total)
- Acessibilidade nativa
- Composição flexível
- Tailwind-friendly

---

## 🔮 Próximos Passos

### Melhorias Arquiteturais

1. **EventosContext**
   - Implementar Context para eventos
   - Padrão similar a TarefasContext

2. **Error Boundary**
   - Tratamento de erros global
   - Fallback UI

3. **React Query**
   - Substituir Context para cache avançado
   - Revalidação automática

4. **Testes**
   - Jest + React Testing Library
   - Testes de integração com Prisma

5. **Monorepo**
   - Separar backend e frontend
   - Shared types package

---

## 📚 Recursos

- [Next.js App Router](https://nextjs.org/docs/app)
- [React Context API](https://react.dev/reference/react/createContext)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Zod Documentation](https://zod.dev)
- [Better Auth Docs](https://better-auth.com/docs)

---

## 🤝 Contribuindo

Ao contribuir, siga estes padrões arquiteturais:

1. Use Context para estado global compartilhado
2. Crie schemas Zod para validação
3. Siga estrutura RESTful nas APIs
4. Componentes devem ser reutilizáveis
5. Documente decisões importantes

---

[← Voltar ao Índice da Documentação](./README.md)

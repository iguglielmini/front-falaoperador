# API de Usuários

## Estrutura criada:

### 1. Schema Prisma (prisma/schema.prisma)
- **Modelo User** com os campos:
  - `id` (UUID)
  - `nome`
  - `sobrenome`
  - `email` (único)
  - `password`
  - `telefone`
  - `dataNascimento`
  - `perfil` (ADMIN ou USUARIO)
  - `createdAt` e `updatedAt`

### 2. Endpoints da API

#### GET /api/users
Lista todos os usuários (sem retornar password)

#### POST /api/users
Cria um novo usuário

**Body:**
```json
{
  "nome": "João",
  "sobrenome": "Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "telefone": "(11) 99999-9999",
  "dataNascimento": "1990-01-15",
  "perfil": "USUARIO"
}
```

#### GET /api/users/[id]
Busca um usuário específico por ID

#### PUT /api/users/[id]
Atualiza um usuário existente

**Body (campos opcionais):**
```json
{
  "nome": "João",
  "sobrenome": "Santos",
  "email": "joao.santos@example.com",
  "telefone": "(11) 98888-8888",
  "perfil": "ADMIN"
}
```

#### DELETE /api/users/[id]
Deleta um usuário

## Próximos passos recomendados:

1. **Segurança:**
   - Implementar hash de senha (bcrypt/argon2)
   - Adicionar autenticação JWT
   - Validar permissões por perfil

2. **Validações:**
   - Usar biblioteca como Zod para validação
   - Validar formato de email e telefone
   - Validar força da senha

3. **Melhorias:**
   - Paginação na listagem
   - Filtros e busca
   - Soft delete

# 🚀 Guia de Setup - Fala Operador

Guia completo de instalação e configuração do projeto.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 20 ou superior)
  - Verifique: `node --version`
  - [Download Node.js](https://nodejs.org/)
  
- **npm** (geralmente vem com Node.js)
  - Verifique: `npm --version`
  - Alternativamente, pode usar **yarn** ou **pnpm**

- **Git**
  - Verifique: `git --version`
  - [Download Git](https://git-scm.com/)

---

## 📥 Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd front-falaoperador
```

### 2. Instale as dependências

```bash
npm install
```

Isso irá instalar todas as dependências listadas no `package.json`, incluindo:
- Next.js 16
- React 19
- Prisma 7
- Better Auth
- Radix UI
- Tailwind CSS

### 3. Configure o banco de dados

O projeto usa **SQLite** com **Prisma ORM**. Execute as migrações para criar as tabelas:

```bash
npx prisma migrate dev
```

Isso irá:
- Criar o arquivo `dev.db` na raiz do projeto
- Aplicar todas as migrações pendentes
- Criar as tabelas: users, sessions, accounts, tarefas

### 4. ⚠️ Gere o Prisma Client (OBRIGATÓRIO)

```bash
npx prisma generate
```

**Este passo é crítico!** Sem ele, você verá o erro:
```
Module not found: Can't resolve '@prisma/client'
```

O comando gera os tipos TypeScript e o cliente Prisma em `node_modules/@prisma/client`.

---

## 🔧 Configuração Adicional

### Variáveis de Ambiente (opcional)

Crie um arquivo `.env` na raiz do projeto se precisar customizar:

```env
# Porta do servidor (padrão: 3000)
PORT=3000

# URL do banco de dados
DATABASE_URL="file:./dev.db"

# Outras configurações conforme necessário
```

### Prisma Studio (opcional)

Para visualizar e editar dados no banco:

```bash
npx prisma studio
```

Isso abrirá uma interface web em `http://localhost:5555`.

---

## ▶️ Executando o Projeto

### Modo Desenvolvimento

```bash
npm run dev
```

O servidor estará disponível em:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **API**: [http://localhost:3000/api](http://localhost:3000/api)
- **Swagger**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

O servidor possui **hot reload** - qualquer alteração no código será refletida automaticamente.

### Build de Produção

```bash
# Criar build otimizado
npm run build

# Executar em produção
npm start
```

---

## 📁 Estrutura do Projeto

```
front-falaoperador/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes (Backend)
│   │   ├── auth/         # Rotas de autenticação
│   │   ├── users/        # CRUD de usuários
│   │   └── tarefas/      # CRUD de tarefas
│   ├── dashboard/         # Páginas do dashboard
│   ├── login/            # Página de login
│   └── register/         # Página de registro
│
├── components/            # Componentes React
│   ├── ui/               # Componentes base (shadcn/ui)
│   ├── auth/             # Componentes de autenticação
│   ├── users/            # Componentes de usuários
│   └── layout/           # Componentes de layout
│
├── lib/                   # Utilitários e configs
│   ├── auth.ts           # Configuração Better Auth
│   ├── prisma.ts         # Cliente Prisma
│   └── utils/            # Funções auxiliares
│
├── prisma/               # Banco de dados
│   ├── schema.prisma     # Schema do banco
│   └── migrations/       # Histórico de migrações
│
├── docs/                 # Documentação
│   ├── SETUP.md         # Este arquivo
│   ├── TROUBLESHOOTING.md
│   └── API_USERS.md
│
└── public/              # Arquivos estáticos
```

---

## 🛠️ Scripts Disponíveis

| Script | Comando | Descrição |
|--------|---------|-----------|
| **Desenvolvimento** | `npm run dev` | Inicia servidor de desenvolvimento |
| **Build** | `npm run build` | Cria build de produção |
| **Produção** | `npm start` | Executa build de produção |
| **Lint** | `npm run lint` | Verifica código com ESLint |
| **Prisma Studio** | `npx prisma studio` | Interface visual do banco |
| **Migrações** | `npx prisma migrate dev` | Aplica migrações |
| **Gerar Client** | `npx prisma generate` | Gera Prisma Client |
| **Reset DB** | `npx prisma migrate reset` | Reseta banco (apaga dados) |

---

## ✅ Verificação da Instalação

Após seguir todos os passos, verifique se tudo está funcionando:

### 1. Servidor rodando
```bash
npm run dev
```
✅ Deve abrir sem erros e mostrar "Ready" no terminal

### 2. Página inicial carrega
Acesse [http://localhost:3000](http://localhost:3000)
✅ Página deve carregar sem erros 404 ou 500

### 3. Prisma Client gerado
```bash
ls node_modules/@prisma/client
```
✅ Deve mostrar arquivos do Prisma Client

### 4. Banco criado
```bash
ls dev.db
```
✅ Arquivo deve existir na raiz

### 5. API funcionando
Acesse [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
✅ Swagger UI deve carregar

---

## 🔄 Fluxo de Trabalho

### Ao clonar o projeto
```bash
npm install
npx prisma migrate dev
npx prisma generate
npm run dev
```

### Ao trocar de branch
```bash
git checkout <branch>
npm install                    # Se houver mudanças em package.json
npx prisma migrate dev        # Se houver novas migrações
npx prisma generate           # Se o schema mudou
```

### Ao modificar o schema.prisma
```bash
npx prisma migrate dev --name descricao_da_mudanca
npx prisma generate
```

---

## 🎯 Próximos Passos

Agora que o projeto está configurado:

1. **Explore a aplicação**: Navegue pelas páginas
2. **Teste a API**: Use o Swagger em `/api-docs`
3. **Crie um usuário**: Use a página de registro
4. **Explore o código**: Veja como está estruturado
5. **Leia a documentação**: Confira outros docs na pasta `docs/`

---

## 📚 Documentação Relacionada

- [← Voltar ao README](../README.md)
- [Troubleshooting](./TROUBLESHOOTING.md)
- [API de Usuários](./API_USERS.md)

---

## 🆘 Problemas?

Se encontrar algum problema durante o setup, consulte o [Guia de Troubleshooting](./TROUBLESHOOTING.md).

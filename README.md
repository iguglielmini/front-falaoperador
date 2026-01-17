# 🎯 Fala Operador - Front-end

Sistema de gerenciamento de usuários e tarefas desenvolvido com Next.js, Prisma e Better Auth.

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748)](https://www.prisma.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

---

## 🚀 Quick Start

```bash
# 1. Clone e instale
git clone <url-do-repositorio>
cd front-falaoperador
npm install

# 2. Configure o banco de dados
npx prisma migrate dev
npx prisma generate

# 3. Execute
npm run dev
```

**Acesse**: [http://localhost:3000](http://localhost:3000)

> ⚠️ **Primeira vez?** Leia o [Guia de Setup completo](./docs/SETUP.md)

---

## 📚 Documentação

| Documento | Descrição |
|-----------|-----------|
| **[📖 Índice da Documentação](./docs/README.md)** | Portal central da documentação |
| **[🚀 Guia de Setup](./docs/SETUP.md)** | Instalação e configuração detalhada |
| **[🔧 Troubleshooting](./docs/TROUBLESHOOTING.md)** | Soluções para problemas comuns |
| **[🔌 API de Usuários](./docs/API_USERS.md)** | Documentação da API REST |

---

## 🎯 Recursos

- ✅ **Autenticação completa** com Better Auth
- ✅ **CRUD de usuários** com validação Zod
- ✅ **CRUD de tarefas** com status e prioridades
- ✅ **Dashboard administrativo** responsivo
- ✅ **API REST documentada** com Swagger
- ✅ **UI moderna** com Radix UI + Tailwind CSS
- ✅ **TypeScript** para segurança de tipos
- ✅ **SQLite + Prisma** para persistência

---

## 🛠️ Tecnologias

<table>
  <tr>
    <td><strong>Framework</strong></td>
    <td>Next.js 16 (App Router)</td>
  </tr>
  <tr>
    <td><strong>Frontend</strong></td>
    <td>React 19, TypeScript, Tailwind CSS</td>
  </tr>
  <tr>
    <td><strong>Backend</strong></td>
    <td>Next.js API Routes, Better Auth</td>
  </tr>
  <tr>
    <td><strong>Banco de Dados</strong></td>
    <td>SQLite + Prisma ORM</td>
  </tr>
  <tr>
    <td><strong>UI Components</strong></td>
    <td>Radix UI, Lucide Icons</td>
  </tr>
  <tr>
    <td><strong>Validação</strong></td>
    <td>Zod</td>
  </tr>
</table>

---

## 📁 Estrutura do Projeto

```
front-falaoperador/
├── app/              # Next.js App Router (páginas + API)
├── components/       # Componentes React reutilizáveis
├── lib/              # Utilitários, configs e helpers
├── prisma/           # Schema e migrações do banco
├── docs/             # 📚 Documentação completa do projeto
└── hooks/            # Custom React Hooks
```

> 📖 Veja a [estrutura completa detalhada](./docs/SETUP.md#-estrutura-do-projeto)

---

## 💻 Scripts Principais

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm start            # Executa build de produção
npx prisma studio    # Interface visual do banco
npx prisma generate  # Gera Prisma Client (obrigatório!)
```

> 📖 Veja [todos os scripts disponíveis](./docs/SETUP.md#-scripts-disponíveis)

---

## 🆘 Encontrou um Problema?

Antes de tudo, consulte o **[Guia de Troubleshooting](./docs/TROUBLESHOOTING.md)** com soluções para:

- ❌ Erros do Prisma Client
- ❌ Problemas de autenticação
- ❌ Erros de build
- ❌ Problemas de ambiente

**Não resolveu?** Abra uma [issue no GitHub](../../issues) com detalhes.

---

## 🚀 Deploy

O projeto está otimizado para deploy na **Vercel**:

1. Push para GitHub
2. Importe na [Vercel](https://vercel.com)
3. Configure variáveis de ambiente
4. Deploy! 🎉

> 📖 Veja o [guia completo de deploy](https://nextjs.org/docs/app/building-your-application/deploying)

---

## 📞 Links Úteis

- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação Prisma](https://www.prisma.io/docs)
- [Documentação Better Auth](https://better-auth.com/docs)
- [Documentação Radix UI](https://www.radix-ui.com/docs)
- [Swagger UI Local](http://localhost:3000/api-docs) (com servidor rodando)

---

## 📄 Licença

Este projeto é privado e de uso interno.

---

<div align="center">
  
**[📖 Documentação Completa](./docs/README.md)** • **[🚀 Setup](./docs/SETUP.md)** • **[🔧 Troubleshooting](./docs/TROUBLESHOOTING.md)** • **[🔌 API](./docs/API_USERS.md)**

</div>

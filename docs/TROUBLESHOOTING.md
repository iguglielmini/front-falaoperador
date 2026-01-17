# 🔧 Troubleshooting

Guia de solução de problemas comuns do projeto Fala Operador.

## 📑 Índice

- [Problemas com Prisma](#problemas-com-prisma)
- [Problemas com Autenticação](#problemas-com-autenticação)
- [Problemas de Build](#problemas-de-build)
- [Problemas de Ambiente](#problemas-de-ambiente)

---

## Problemas com Prisma

### ❌ Erro: "Module not found: Can't resolve '@prisma/client'"

**Causa**: O Prisma Client não foi gerado após clonar o repositório ou modificar o schema.

**Solução**:
```bash
npx prisma generate
```

Este comando deve ser executado sempre que:
- Clonar o projeto pela primeira vez
- Modificar o arquivo `prisma/schema.prisma`
- Trocar de branch com mudanças no schema
- Atualizar a versão do Prisma

---

### ❌ Erro ao executar migrações

**Causa**: Banco de dados corrompido ou permissões incorretas.

**Solução 1** - Resetar o banco de desenvolvimento:
```bash
rm dev.db
npx prisma migrate dev
```

**Solução 2** - Resetar completamente:
```bash
npx prisma migrate reset
```

⚠️ **Atenção**: `migrate reset` apaga todos os dados!

---

### ❌ Mudanças no schema não refletem no código

**Causa**: Falta executar os comandos após modificar o schema.

**Solução**: Execute sempre nesta ordem:
```bash
# 1. Criar e aplicar migração
npx prisma migrate dev --name descricao_da_mudanca

# 2. Gerar o Prisma Client atualizado
npx prisma generate
```

---

### ❌ Erro: "Can't reach database server"

**Causa**: Problema na conexão com o banco de dados SQLite.

**Solução**:
1. Verifique se o arquivo `dev.db` existe
2. Verifique permissões do arquivo
3. Execute as migrações:
```bash
npx prisma migrate dev
```

---

## Problemas com Autenticação

### ❌ Não consigo fazer login

**Possíveis causas e soluções**:

1. **Usuário não existe**
   - Verifique no Prisma Studio: `npx prisma studio`
   - Crie um usuário através da API de registro

2. **Senha incorreta**
   - Use a API de reset de senha
   - Verifique se a senha está sendo hasheada corretamente

3. **EmailVerified false**
   - Verifique no banco e atualize manualmente se necessário

---

### ❌ Token de sessão expirado

**Solução**: Faça logout e login novamente. As sessões são gerenciadas pelo Better Auth.

---

## Problemas de Build

### ❌ Erro: "Type error" durante build

**Causa**: Erros de tipagem TypeScript.

**Solução**:
1. Execute o lint:
```bash
npm run lint
```

2. Verifique os erros no terminal
3. Corrija os tipos apontados

---

### ❌ Build bem-sucedido mas aplicação quebrada

**Causa**: Variáveis de ambiente ou Prisma Client desatualizado.

**Solução**:
```bash
# 1. Gere o Prisma Client
npx prisma generate

# 2. Limpe o cache do Next.js
rm -rf .next

# 3. Reconstrua
npm run build
```

---

## Problemas de Ambiente

### ❌ Porta 3000 já em uso

**Solução**: Use outra porta:
```bash
PORT=3001 npm run dev
```

Ou mate o processo na porta 3000:
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

### ❌ Módulos não encontrados após git pull

**Causa**: Novas dependências foram adicionadas.

**Solução**:
```bash
# Reinstale as dependências
npm install

# Se persistir, limpe e reinstale
rm -rf node_modules package-lock.json
npm install
```

---

### ❌ Erro "ENOSPC: System limit for number of file watchers reached"

**Causa**: Limite de watchers do sistema (Linux).

**Solução**:
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

---

## 🆘 Ainda com problemas?

Se nenhuma solução acima resolveu seu problema:

1. **Verifique os logs**: Leia atentamente as mensagens de erro
2. **Pesquise no código**: Use `grep` ou busca do VSCode
3. **Consulte a documentação**:
   - [Documentação de Setup](./SETUP.md)
   - [Documentação da API](./API_USERS.md)
4. **Verifique issues no GitHub**: Pode ser um problema conhecido
5. **Abra uma issue**: Descreva o problema detalhadamente

---

## 📚 Documentação Relacionada

- [← Voltar ao README](../README.md)
- [Guia de Setup](./SETUP.md)
- [API de Usuários](./API_USERS.md)

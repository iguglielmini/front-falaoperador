import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/utils/password';

/**
 * Script para migrar usuários existentes para o Better Auth
 * Execute: npx tsx scripts/migrate-users.ts
 */
async function migrateUsers() {
  try {
    console.log('🔄 Iniciando migração de usuários...');

    // Buscar todos os usuários que não têm conta no Better Auth
    const users = await prisma.user.findMany({
      where: {
        accounts: {
          none: {}
        }
      }
    });

    console.log(`📋 Encontrados ${users.length} usuários para migrar`);

    for (const user of users) {
      // Criar uma conta no Better Auth para cada usuário
      await prisma.account.create({
        data: {
          userId: user.id,
          accountId: user.email,
          providerId: 'credential',
          password: user.password, // A senha já está hasheada
        }
      });

      console.log(`✅ Usuário ${user.email} migrado com sucesso`);
    }

    console.log('🎉 Migração concluída!');
  } catch (error) {
    console.error('❌ Erro na migração:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateUsers();

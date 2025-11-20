import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Conectar ao inicializar
prisma.$connect()
  .then(() => console.log('🗄️ Banco conectado com sucesso!'))
  .catch((error) => console.error('❌ Erro ao conectar com banco:', error));

export default prisma;
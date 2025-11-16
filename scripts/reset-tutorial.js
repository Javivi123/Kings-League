// Script para resetear el estado del tutorial de todos los usuarios
// Útil para testing o si quieres que todos los usuarios vean el tutorial de nuevo

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🔄 Reseteando estado del tutorial para todos los usuarios...');

    const result = await prisma.user.updateMany({
      data: {
        hasSeenTutorial: false,
      },
    });

    console.log(`✅ Tutorial reseteado para ${result.count} usuarios`);
    console.log('📝 Todos los usuarios verán el tutorial la próxima vez que inicien sesión');
  } catch (error) {
    console.error('❌ Error al resetear el tutorial:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();


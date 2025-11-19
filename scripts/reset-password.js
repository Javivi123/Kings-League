// Script para resetear la contraseña de un usuario
// Uso: node scripts/reset-password.js <email> [nueva-contraseña]

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const prisma = new PrismaClient();

// Función para leer input del usuario
function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }));
}

async function main() {
  try {
    // Obtener email desde argumentos de línea de comandos o preguntar
    let email = process.argv[2];
    let newPassword = process.argv[3];

    if (!email) {
      email = await askQuestion('📧 Ingresa el email del usuario: ');
    }

    if (!email) {
      console.error('❌ Error: Debes proporcionar un email');
      process.exit(1);
    }

    // Buscar el usuario
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      console.error(`❌ Error: No se encontró un usuario con el email "${email}"`);
      process.exit(1);
    }

    console.log(`\n👤 Usuario encontrado:`);
    console.log(`   - Nombre: ${user.name}`);
    console.log(`   - Email: ${user.email}`);
    console.log(`   - Rol: ${user.role}\n`);

    // Si no se proporcionó contraseña, preguntar
    if (!newPassword) {
      newPassword = await askQuestion('🔑 Ingresa la nueva contraseña (mínimo 6 caracteres): ');
      
      if (!newPassword || newPassword.length < 6) {
        console.error('❌ Error: La contraseña debe tener al menos 6 caracteres');
        process.exit(1);
      }

      const confirmPassword = await askQuestion('🔑 Confirma la nueva contraseña: ');
      
      if (newPassword !== confirmPassword) {
        console.error('❌ Error: Las contraseñas no coinciden');
        process.exit(1);
      }
    }

    // Hashear la nueva contraseña
    console.log('\n🔄 Hasheando nueva contraseña...');
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar el usuario
    await prisma.user.update({
      where: { email: email },
      data: { password: hashedPassword },
    });

    console.log('✅ Contraseña actualizada exitosamente!');
    console.log(`\n📝 El usuario "${user.name}" ahora puede iniciar sesión con la nueva contraseña.\n`);

  } catch (error) {
    console.error('❌ Error al resetear la contraseña:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();


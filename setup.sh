#!/bin/bash

echo "🚀 Configurando Kings League..."
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado."
    echo "Por favor, instala Node.js desde https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"
echo "✅ npm encontrado: $(npm --version)"
echo ""

# Crear .env si no existe
if [ ! -f .env ]; then
    echo "📝 Creando archivo .env..."
    cat > .env << EOF
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"

# Para PostgreSQL en producción:
# DATABASE_URL="postgresql://user:password@localhost:5432/kingsleague?schema=public"
EOF
    echo "✅ Archivo .env creado"
else
    echo "ℹ️  El archivo .env ya existe"
fi

echo ""
echo "📦 Generando cliente de Prisma..."
npx prisma generate

echo ""
echo "🗄️  Creando base de datos..."
npx prisma migrate dev --name init

echo ""
echo "✅ ¡Configuración completada!"
echo ""
echo "Para iniciar el servidor, ejecuta:"
echo "  npm run dev"
echo ""
echo "La aplicación estará disponible en: http://localhost:3000"


#!/bin/bash

echo "🗄️  Abriendo Prisma Studio..."
echo ""
echo "📝 Prisma Studio es una interfaz visual para gestionar tu base de datos."
echo "   Se abrirá en tu navegador en: http://localhost:5555"
echo ""
echo "💡 Puedes:"
echo "   - Ver todos los datos (usuarios, equipos, jugadores, etc.)"
echo "   - Crear nuevos registros"
echo "   - Editar registros existentes"
echo "   - Eliminar registros"
echo ""
echo "⚠️  Para cerrar Prisma Studio, presiona Ctrl+C en esta terminal"
echo ""

npx prisma studio


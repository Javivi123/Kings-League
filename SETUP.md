# Guía de Configuración - Kings League

## ✅ Paso 1: Verificar Node.js

Abre una **nueva terminal** y ejecuta:

```bash
node --version
npm --version
```

Si ves las versiones, continúa. Si no, necesitas instalar Node.js desde https://nodejs.org/

## ✅ Paso 2: Instalar Dependencias

Ya deberías tener `node_modules` instalado. Si no, ejecuta:

```bash
cd "/Users/javier/Desktop/new/Kings League"
npm install
```

## ✅ Paso 3: Configurar Variables de Entorno

Crea el archivo `.env` con el siguiente comando (genera automáticamente un `NEXTAUTH_SECRET` seguro):

```bash
cd "/Users/javier/Desktop/new/Kings League"
cat > .env << 'EOF'
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
EOF
```

**Nota:** El comando anterior creará el archivo `.env` pero el `NEXTAUTH_SECRET` se generará como literal. Para generar un secreto único, ejecuta primero:

```bash
openssl rand -base64 32
```

Y luego crea el archivo `.env` manualmente con ese valor, o usa este método alternativo:

```bash
# Generar el secreto
SECRET=$(openssl rand -base64 32)

# Crear el archivo .env
cat > .env << EOF
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="${SECRET}"
EOF
```

**Verificar que se creó correctamente:**
```bash
cat .env
```

## ✅ Paso 4: Configurar Base de Datos

Genera el cliente de Prisma:

```bash
npx prisma generate
```

Crea la base de datos y ejecuta las migraciones:

```bash
npx prisma migrate dev --name init
```

Esto creará el archivo `dev.db` (base de datos SQLite).

## ✅ Paso 5: Crear Usuario Admin

Crea un usuario administrador:

```bash
npm run db:create-admin
```

O usa Prisma Studio para crear usuarios manualmente.

## ✅ Paso 6: (Opcional) Generar Datos de Prueba

Genera datos de prueba para probar la aplicación:

```bash
npm run db:seed
```

Esto creará usuarios, equipos, jugadores, partidos y noticias de ejemplo.

## ✅ Paso 7: (Opcional) Ver la Base de Datos

Puedes abrir Prisma Studio para ver y editar la base de datos:

```bash
npm run db:open
# O: npx prisma studio
```

Se abrirá en http://localhost:5555

## ✅ Paso 8: Iniciar el Servidor

**⚠️ IMPORTANTE:** Usa `npm run dev`, NO `npx run dev`

```bash
npm run dev
```

**Nota:** `npx run dev` intentará instalar un paquete inexistente llamado "run" y fallará. El comando correcto es `npm run dev` porque ejecuta el script "dev" definido en `package.json`.

La aplicación estará disponible en: **http://localhost:3000**

## 🎉 ¡Listo!

Ahora puedes:
- Ir a http://localhost:3000
- Registrarte como usuario
- Crear equipos, jugadores, etc.

## 📝 Notas Importantes

1. **Primer usuario admin**: Usa `npm run db:create-admin` o crea uno manualmente en Prisma Studio.

2. **Base de datos**: Por defecto usa SQLite (`dev.db`). Para producción, cambia a PostgreSQL en `prisma/schema.prisma`.

3. **Imágenes**: Los logos y fotos se guardan como URLs. Considera usar un servicio de almacenamiento en la nube.

4. **Resetear contraseñas**: Si olvidas una contraseña, usa `npm run db:reset-password` (ver `RESETEAR_CONTRASEÑA.md`).

5. **Título de la aplicación**: "Cumbres Kings League" (visible en la pestaña del navegador).

## 🆘 Problemas Comunes

### "node: command not found"
- Cierra y abre una nueva terminal
- Verifica que Node.js esté instalado: https://nodejs.org/

### "Error: EACCES" al instalar
- No uses `sudo` con npm
- Si es necesario, cambia el propietario de `node_modules`

### "Prisma Client not found"
- Ejecuta: `npx prisma generate`

### "Database not found"
- Ejecuta: `npx prisma migrate dev --name init`


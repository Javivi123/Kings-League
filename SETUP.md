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

Crea el archivo `.env` copiando el ejemplo:

```bash
cp .env.example .env
```

Luego edita `.env` y cambia el `NEXTAUTH_SECRET` por uno seguro. Puedes generar uno con:

```bash
openssl rand -base64 32
```

O simplemente usa cualquier cadena larga y aleatoria.

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

## ✅ Paso 5: (Opcional) Ver la Base de Datos

Puedes abrir Prisma Studio para ver y editar la base de datos:

```bash
npx prisma studio
```

Se abrirá en http://localhost:5555

## ✅ Paso 6: Iniciar el Servidor

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:3000**

## 🎉 ¡Listo!

Ahora puedes:
- Ir a http://localhost:3000
- Registrarte como usuario
- Crear equipos, jugadores, etc.

## 📝 Notas Importantes

1. **Primer usuario admin**: Necesitarás crear un usuario admin manualmente en la base de datos o a través de Prisma Studio.

2. **Base de datos**: Por defecto usa SQLite (`dev.db`). Para producción, cambia a PostgreSQL en `prisma/schema.prisma`.

3. **Imágenes**: Los logos y fotos se guardan como URLs. Considera usar un servicio de almacenamiento en la nube.

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


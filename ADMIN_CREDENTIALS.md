# 🔐 Credenciales de Administrador

## Usuario Admin por Defecto

**Email:** `admin@kingsleague.com`  
**Password:** `Admin123!`

⚠️ **IMPORTANTE:** Cambia esta contraseña después del primer inicio de sesión desde la página de Configuración.

## 🚀 Cómo Crear el Usuario Admin

Si el usuario admin no existe, ejecuta:

```bash
npx tsx scripts/create-admin.ts
```

O si no tienes tsx instalado:

```bash
npm install -g tsx
npx tsx scripts/create-admin.ts
```

## 🗄️ Acceso a la Base de Datos

### Opción 1: Prisma Studio (Interfaz Visual)

Ejecuta el script:

```bash
./scripts/open-db.sh
```

O manualmente:

```bash
npx prisma studio
```

Se abrirá en: **http://localhost:5555**

### Opción 2: SQLite Browser (Si usas SQLite)

Si estás usando SQLite, puedes abrir el archivo `prisma/dev.db` con cualquier visor de SQLite.

## 📝 Qué es Prisma Studio?

Prisma Studio es una herramienta visual que te permite:

- ✅ Ver todos los datos de tu base de datos
- ✅ Crear nuevos registros (usuarios, equipos, jugadores, etc.)
- ✅ Editar registros existentes
- ✅ Eliminar registros
- ✅ Buscar y filtrar datos
- ✅ Ver relaciones entre tablas

### Cómo usar Prisma Studio:

1. Ejecuta `./scripts/open-db.sh` o `npx prisma studio`
2. Se abrirá automáticamente en tu navegador
3. Verás todas las tablas en el menú lateral
4. Haz clic en una tabla para ver sus datos
5. Usa el botón "+" para crear nuevos registros
6. Haz clic en un registro para editarlo
7. Usa el botón de eliminar para borrar registros

## 🔒 Seguridad

- **Nunca compartas estas credenciales**
- **Cambia la contraseña después del primer uso**
- **Solo crea usuarios desde el panel de admin o Prisma Studio**
- **El registro público está deshabilitado por seguridad**

## 👥 Crear Otros Usuarios

### Desde Prisma Studio:

1. Abre Prisma Studio
2. Ve a la tabla "users"
3. Haz clic en el botón "+"
4. Completa los campos:
   - `email`: Email del usuario
   - `name`: Nombre del usuario
   - `password`: Debe estar hasheado (usa bcrypt)
   - `role`: "alumno", "jugador", "presidente", o "admin"
   - `age`: (opcional)
5. Guarda

### Desde el Panel de Admin (cuando esté implementado):

Ve a `/admin/users` y crea usuarios desde ahí.

## 🛠️ Hashear Contraseñas

Para crear usuarios manualmente, necesitas hashear las contraseñas. Puedes usar:

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('tu-password', 10).then(hash => console.log(hash))"
```

O desde Prisma Studio, crea el usuario y luego actualiza la contraseña desde la aplicación.

## 🔑 Resetear Contraseñas

Si un usuario ha olvidado su contraseña, puedes resetearla usando el script:

```bash
npm run db:reset-password
```

El script te pedirá:
1. El email del usuario
2. La nueva contraseña (mínimo 6 caracteres)
3. Confirmación de la nueva contraseña

**Ejemplo:**
```bash
$ npm run db:reset-password
📧 Ingresa el email del usuario: usuario@ejemplo.com
🔑 Ingresa la nueva contraseña: nuevaPassword123
🔑 Confirma la nueva contraseña: nuevaPassword123
✅ Contraseña actualizada exitosamente!
```

**Nota:** Las contraseñas están hasheadas con bcrypt y no se pueden deshashear. Solo puedes resetearlas estableciendo una nueva.

📖 **Ver guía completa:** [`RESETEAR_CONTRASEÑA.md`](./RESETEAR_CONTRASEÑA.md)


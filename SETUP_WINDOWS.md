# 🪟 Guía de Instalación para Windows - Kings League

Esta guía te ayudará a ejecutar el proyecto Kings League en Windows paso a paso.

---

## 📋 Requisitos Previos

### 1. Instalar Node.js

1. Ve a **https://nodejs.org/**
2. Descarga la versión **LTS** (recomendada)
3. Ejecuta el instalador `.msi`
4. Durante la instalación, **marca la casilla** "Add to PATH" (si aparece)
5. Reinicia tu computadora después de instalar

### 2. Verificar Instalación

Abre **PowerShell** o **CMD** (presiona `Win + R`, escribe `cmd` y Enter) y ejecuta:

```powershell
node --version
npm --version
```

Si ves números de versión (ej: `v20.10.0` y `10.2.3`), ¡estás listo! ✅

Si aparece un error, Node.js no está instalado o no está en el PATH.

---

## 🚀 Instalación del Proyecto

### Paso 1: Abrir el Proyecto

1. **Extrae o copia** la carpeta del proyecto a tu escritorio o donde prefieras
2. Abre **PowerShell** o **CMD** en esa carpeta:
   - **Opción A:** Navega con `cd`:
     ```powershell
     cd "C:\Users\TuUsuario\Desktop\Kings League"
     ```
   - **Opción B:** Abre PowerShell en la carpeta:
     - Navega a la carpeta en el Explorador de Windows
     - Haz clic derecho en la carpeta
     - Selecciona "Abrir en Terminal" o "Abrir PowerShell aquí"

### Paso 2: Instalar Dependencias

En la terminal, ejecuta:

```powershell
npm install
```

⏱️ Esto puede tardar 2-5 minutos. Espera a que termine.

### Paso 3: Crear Archivo .env

Necesitas crear un archivo llamado `.env` en la raíz del proyecto.

**Opción A: Desde PowerShell**
```powershell
New-Item -Path .env -ItemType File
notepad .env
```

**Opción B: Manualmente**
1. Abre el Bloc de notas (Notepad)
2. Copia y pega este contenido:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="kings-league-secret-key-2025-javier-sanchez"
```

3. Guarda el archivo como `.env` (sin extensión `.txt`)
   - En "Guardar como", selecciona "Todos los archivos" en el tipo
   - El nombre debe ser exactamente: `.env`

### Paso 4: Generar Cliente de Prisma

```powershell
npx prisma generate
```

Esto crea el cliente de Prisma para conectarse a la base de datos.

### Paso 5: Crear Base de Datos

```powershell
npx prisma migrate dev --name init
```

Esto creará el archivo `dev.db` (base de datos SQLite) y ejecutará las migraciones.

✅ Si todo va bien, verás: `✔ Applied migration`

---

## 🎯 Ejecutar el Proyecto

### Iniciar el Servidor de Desarrollo

```powershell
npm run dev
```

Espera a ver este mensaje:
```
✓ Ready in 2.5s
○ Local:        http://localhost:3000
```

### Abrir en el Navegador

1. Abre tu navegador (Chrome, Edge, Firefox)
2. Ve a: **http://localhost:3000**
3. ¡Deberías ver la página de inicio de Kings League! 🎉

---

## 👤 Crear Usuario Admin (Primera Vez)

Para poder iniciar sesión, necesitas crear un usuario admin. Tienes dos opciones:

### Opción 1: Script Automático (Recomendado)

```powershell
npm run db:create-admin
```

Esto creará un usuario con:
- **Email:** `admin@kingsleague.com`
- **Password:** `Admin123!`

### Opción 2: Prisma Studio (Interfaz Visual)

1. En otra terminal, ejecuta:
   ```powershell
   npx prisma studio
   ```
2. Se abrirá en: **http://localhost:5555**
3. Ve a la tabla `User`
4. Crea un nuevo usuario con:
   - `email`: `admin@kingsleague.com`
   - `password`: (debe estar hasheado con bcrypt - mejor usa la Opción 1)
   - `role`: `ADMIN`
   - `name`: Tu nombre

---

## 📊 Comandos Útiles

### Ver Base de Datos (Prisma Studio)
```powershell
npx prisma studio
```
Se abre en: http://localhost:5555

### Generar Datos de Prueba
```powershell
npm run db:seed
```

### Crear Usuario Admin
```powershell
npm run db:create-admin
```

### Resetear Tutorial (para todos los usuarios)
```powershell
npm run db:reset-tutorial
```

---

## 🆘 Solución de Problemas

### ❌ "node: no se reconoce como comando"

**Problema:** Node.js no está instalado o no está en el PATH.

**Solución:**
1. Instala Node.js desde https://nodejs.org/
2. Reinicia tu computadora
3. Abre una nueva terminal y prueba de nuevo

### ❌ "npm: no se reconoce como comando"

**Problema:** npm no está disponible.

**Solución:**
- Reinstala Node.js (npm viene incluido)
- Asegúrate de marcar "Add to PATH" durante la instalación

### ❌ "Error: EPERM" o "Error: EACCES"

**Problema:** Permisos insuficientes.

**Solución:**
1. Cierra cualquier editor de código que tenga el proyecto abierto
2. Ejecuta PowerShell como Administrador:
   - Clic derecho en PowerShell
   - "Ejecutar como administrador"
3. Navega al proyecto y ejecuta `npm install` de nuevo

### ❌ "Prisma Client not found"

**Problema:** El cliente de Prisma no se generó.

**Solución:**
```powershell
npx prisma generate
```

### ❌ "Database not found" o "Migration failed"

**Problema:** La base de datos no existe o las migraciones fallaron.

**Solución:**
```powershell
npx prisma migrate dev --name init
```

Si sigue fallando:
```powershell
# Eliminar base de datos antigua (si existe)
Remove-Item prisma\dev.db -ErrorAction SilentlyContinue
# Crear de nuevo
npx prisma migrate dev --name init
```

### ❌ "Port 3000 is already in use"

**Problema:** Otra aplicación está usando el puerto 3000.

**Solución 1:** Cerrar la otra aplicación
```powershell
# Encontrar qué usa el puerto 3000
netstat -ano | findstr :3000
# Matar el proceso (reemplaza PID con el número que aparezca)
taskkill /PID [PID] /F
```

**Solución 2:** Usar otro puerto
```powershell
$env:PORT=3001; npm run dev
```

### ❌ El navegador muestra "This site can't be reached"

**Problema:** El servidor no está corriendo o hay un error.

**Solución:**
1. Verifica que el servidor esté corriendo (debe decir "Ready")
2. Asegúrate de usar `http://localhost:3000` (no `https://`)
3. Revisa la terminal por errores
4. Intenta detener el servidor (Ctrl+C) y reiniciarlo

### ❌ "Cannot find module" o errores de importación

**Problema:** Las dependencias no se instalaron correctamente.

**Solución:**
```powershell
# Eliminar node_modules y reinstalar
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

---

## 📝 Notas Importantes para Windows

### Rutas de Archivos

- Windows usa `\` en vez de `/` en las rutas
- Pero en el código (JavaScript/TypeScript) siempre usa `/`
- El proyecto ya está configurado para funcionar en Windows

### Scripts de Shell (.sh)

- Los scripts `.sh` (como `open-db.sh`) son para Linux/Mac
- En Windows, usa los comandos directamente:
  - En vez de `./scripts/open-db.sh`, usa: `npx prisma studio`

### Base de Datos SQLite

- El archivo `dev.db` se crea en `prisma/dev.db`
- Es un archivo normal, puedes copiarlo/backupearlo
- No necesitas instalar nada adicional para SQLite

### Variables de Entorno

- El archivo `.env` debe estar en la raíz del proyecto
- No debe tener extensión `.txt`
- Si no se crea automáticamente, créalo manualmente (ver Paso 3)

---

## 🎯 Resumen Rápido (Copy-Paste)

Si ya tienes Node.js instalado, ejecuta estos comandos en orden:

```powershell
# 1. Instalar dependencias
npm install

# 2. Crear .env (copia el contenido del Paso 3 manualmente)

# 3. Generar Prisma
npx prisma generate

# 4. Crear base de datos
npx prisma migrate dev --name init

# 5. Crear admin
npm run db:create-admin

# 6. Iniciar servidor
npm run dev
```

Luego abre: **http://localhost:3000**

---

## ✅ Checklist de Verificación

Antes de mostrar el proyecto a tu jefe, verifica:

- [ ] Node.js instalado y funcionando (`node --version`)
- [ ] Dependencias instaladas (`npm install` completado)
- [ ] Archivo `.env` creado con las 3 variables
- [ ] Base de datos creada (`prisma/dev.db` existe)
- [ ] Usuario admin creado
- [ ] Servidor corriendo (`npm run dev` sin errores)
- [ ] Página carga en http://localhost:3000
- [ ] Puedes hacer login con el usuario admin

---

## 🎉 ¡Listo!

Si sigues estos pasos, el proyecto debería funcionar perfectamente en Windows.

**Credenciales por defecto:**
- Email: `admin@kingsleague.com`
- Password: `Admin123!`

**Para mostrar el Modo TV:**
1. Login como admin
2. Ve a Configuración (Settings)
3. Click en "🖥️ Abrir Modo TV"
4. O ve directamente a: http://localhost:3000/tv

---

**¿Problemas?** Revisa la sección "Solución de Problemas" arriba o verifica que todos los pasos se hayan completado correctamente.


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
2. **IMPORTANTE:** Asegúrate de estar en la carpeta correcta antes de continuar
3. Abre **PowerShell** o **CMD** en esa carpeta:
   - **Opción A (Recomendada):** Abre PowerShell directamente en la carpeta:
     - Navega a la carpeta en el **Explorador de Windows**
     - Haz clic derecho en la carpeta (no en un archivo, sino en espacio vacío)
     - Selecciona **"Abrir en Terminal"** o **"Abrir PowerShell aquí"**
     - Esto garantiza que estás en la carpeta correcta
   - **Opción B:** Navega con `cd`:
     ```powershell
     cd "C:\Users\TuUsuario\Desktop\new\Kings League"
     # O la ruta donde tengas el proyecto
     ```

### Paso 2: Instalar Dependencias

**IMPORTANTE:** Asegúrate de estar en la carpeta correcta del proyecto.

En la terminal, ejecuta:

```powershell
# Verificar que estás en el lugar correcto
pwd
# Debe mostrar la ruta que termina en "Kings League"

# Verificar que existe package.json
Test-Path package.json
# Debe devolver: True

# Si todo está bien, instalar dependencias
npm install
```

⏱️ Esto puede tardar 2-5 minutos. Espera a que termine.

**Si da errores:**
- Verifica que estás en la carpeta correcta
- Asegúrate de que existe el archivo `package.json`
- Revisa la sección "Solución de Problemas" más abajo

### Paso 3: Crear Archivo .env

Necesitas crear un archivo llamado `.env` en la raíz del proyecto.

**Opción A: Desde PowerShell (Recomendado - Más Rápido)**
```powershell
# Crear el archivo .env con el contenido necesario
@"
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="kings-league-secret-key-2025-javier-sanchez"
"@ | Out-File -FilePath .env -Encoding utf8

# Verificar que se creó correctamente
Test-Path .env
# Debe devolver: True

# Ver el contenido (opcional)
Get-Content .env
```

**Opción B: Crear y editar manualmente**
```powershell
# Crear el archivo vacío
New-Item -Path .env -ItemType File

# Abrir en el Bloc de notas para editarlo
notepad .env
```
Luego copia y pega este contenido en el Bloc de notas:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="kings-league-secret-key-2025-javier-sanchez"
```
Guarda el archivo (Ctrl+S) y cierra el Bloc de notas.

**Opción C: Usando echo (Método alternativo)**
```powershell
echo 'DATABASE_URL="file:./dev.db"' > .env
echo 'NEXTAUTH_URL="http://localhost:3000"' >> .env
echo 'NEXTAUTH_SECRET="kings-league-secret-key-2025-javier-sanchez"' >> .env
```

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

**⚠️ IMPORTANTE:** Usa `npm run dev`, NO `npx run dev`

```powershell
npm run dev
```

**Nota:** `npx run dev` intentará instalar un paquete inexistente llamado "run" y fallará. El comando correcto es `npm run dev` porque ejecuta el script "dev" definido en `package.json`.

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

### ❌ "npm install" da errores de "no encuentra archivos"

**Problema:** Puede ser por varias razones. 

📖 **Ver guía completa:** [`SOLUCION_NPM_INSTALL_WINDOWS.md`](./SOLUCION_NPM_INSTALL_WINDOWS.md)

**Solución rápida:**

**Solución 1: Verificar que estás en el directorio correcto**
```powershell
# Verificar que estás en la carpeta del proyecto
pwd
# Debe mostrar la ruta que termina en "Kings League"

# Verificar que existe package.json
Test-Path package.json
# Debe devolver: True
```

**Si devuelve `False`:**
- 📖 **Ver guía completa:** [`VERIFICAR_UBICACION.md`](./VERIFICAR_UBICACION.md)
- O sigue estos pasos rápidos:
  1. Abre el **Explorador de Windows**
  2. Navega a la carpeta del proyecto manualmente
  3. Haz clic derecho en la carpeta → **"Abrir en Terminal"**
  4. Esto te pondrá automáticamente en la carpeta correcta

**Solución 2: Limpiar caché de npm**
```powershell
npm cache clean --force
npm install
```

**Solución 3: Eliminar node_modules y package-lock.json (si existen)**
```powershell
# Si ya intentaste instalar antes y falló
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue
npm install
```

**Solución 4: Instalar con verbose para ver el error exacto**
```powershell
npm install --verbose
```
Esto mostrará más detalles sobre qué archivo específico no encuentra.

**Solución 5: Verificar permisos**
```powershell
# Ejecutar PowerShell como Administrador
# Clic derecho en PowerShell → "Ejecutar como administrador"
# Luego navegar al proyecto y ejecutar npm install
```

**Solución 6: Si el error menciona "scripts" o archivos .sh**
- El proyecto ya está actualizado para funcionar en Windows
- El script `db:open` ahora usa `npx prisma studio` directamente
- Si ves errores sobre `.sh`, actualiza el proyecto con la última versión

**Solución 7: Instalar sin scripts opcionales**
```powershell
npm install --ignore-scripts
npm install
```

**Solución 8: Verificar versión de Node.js**
```powershell
node --version
npm --version
```
- Node.js debe ser versión 18 o superior
- Si es muy antigua, actualiza desde https://nodejs.org/

**💡 Si el problema persiste:** Consulta la guía completa en `SOLUCION_NPM_INSTALL_WINDOWS.md` que tiene soluciones paso a paso para cada tipo de error específico.

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


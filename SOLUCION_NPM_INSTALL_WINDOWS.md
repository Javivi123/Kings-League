# 🔧 Solución: "npm install" no encuentra archivos en Windows

Si al ejecutar `npm install` te aparece un error diciendo que no encuentra archivos, sigue estos pasos en orden:

---

## ✅ Paso 1: Verificar Ubicación

Asegúrate de estar en la carpeta correcta del proyecto:

```powershell
# Ver dónde estás
pwd

# Debe mostrar algo como:
# C:\Users\TuUsuario\Desktop\Kings League
# o
# C:\Users\TuUsuario\Documents\Kings League

# Verificar que existe package.json
Test-Path package.json
# Debe devolver: True
```

**Si devuelve `False`**, estás en la carpeta incorrecta. Navega a la carpeta del proyecto:

```powershell
cd "C:\ruta\completa\al\proyecto\Kings League"
```

---

## ✅ Paso 2: Limpiar Instalación Anterior (si existe)

Si ya intentaste instalar antes y falló:

```powershell
# Eliminar node_modules si existe
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue

# Eliminar package-lock.json si existe
Remove-Item package-lock.json -ErrorAction SilentlyContinue

# Limpiar caché de npm
npm cache clean --force
```

---

## ✅ Paso 3: Verificar Node.js y npm

```powershell
node --version
npm --version
```

- **Node.js** debe ser versión **18 o superior**
- **npm** debe ser versión **9 o superior**

Si son versiones muy antiguas, actualiza desde: https://nodejs.org/

---

## ✅ Paso 4: Instalar con Información Detallada

Ejecuta `npm install` con el flag `--verbose` para ver exactamente qué archivo no encuentra:

```powershell
npm install --verbose
```

**Copia el error completo** que aparezca. Esto nos dirá exactamente qué archivo falta.

---

## ✅ Paso 5: Soluciones Específicas por Tipo de Error

### Error: "ENOENT: no such file or directory"

**Causa:** Falta algún archivo de configuración.

**Solución:** Verifica que existan estos archivos en la raíz del proyecto:
- ✅ `package.json`
- ✅ `tsconfig.json`
- ✅ `next.config.js`
- ✅ `tailwind.config.ts`
- ✅ `postcss.config.js`

Si falta alguno, el proyecto está incompleto. Necesitas descargar/copiar todos los archivos.

### Error: "Cannot read property" o errores de scripts

**Causa:** El `package.json` tiene scripts que referencian archivos que no existen.

**Solución:** El proyecto ya está actualizado. El script `db:open` ahora funciona en Windows. Si ves este error, asegúrate de tener la última versión del `package.json`.

### Error: "Permission denied" o "EACCES"

**Causa:** Permisos insuficientes.

**Solución:**
1. Cierra cualquier editor de código (VS Code, etc.)
2. Ejecuta PowerShell como **Administrador**:
   - Clic derecho en PowerShell
   - "Ejecutar como administrador"
3. Navega al proyecto y ejecuta `npm install`

### Error: "npm ERR! code ELIFECYCLE"

**Causa:** Error durante la ejecución de scripts post-install.

**Solución:**
```powershell
# Instalar sin ejecutar scripts
npm install --ignore-scripts

# Luego instalar normalmente
npm install
```

### Error: "npm ERR! code ERESOLVE"

**Causa:** Conflictos de versiones de dependencias.

**Solución:**
```powershell
npm install --legacy-peer-deps
```

---

## ✅ Paso 6: Instalación Paso a Paso (Método Seguro)

Si nada funciona, prueba este método paso a paso:

```powershell
# 1. Limpiar todo
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue
npm cache clean --force

# 2. Verificar Node.js
node --version
npm --version

# 3. Instalar sin scripts primero
npm install --ignore-scripts

# 4. Si el paso 3 funciona, instalar normalmente
npm install

# 5. Si sigue fallando, usar legacy peer deps
npm install --legacy-peer-deps
```

---

## ✅ Paso 7: Verificar Archivos Necesarios

Asegúrate de que estos archivos existan en la raíz del proyecto:

```
Kings League/
├── package.json          ✅ DEBE EXISTIR
├── tsconfig.json         ✅ DEBE EXISTIR
├── next.config.js        ✅ DEBE EXISTIR
├── tailwind.config.ts    ✅ DEBE EXISTIR
├── postcss.config.js     ✅ DEBE EXISTIR
├── .gitignore            ✅ (opcional)
├── prisma/
│   └── schema.prisma     ✅ DEBE EXISTIR
└── app/                  ✅ DEBE EXISTIR
```

**Si falta alguno**, el proyecto está incompleto.

---

## 🆘 Si Nada Funciona

1. **Copia el error completo** de la terminal
2. Verifica:
   - ✅ Estás en la carpeta correcta
   - ✅ Existe `package.json`
   - ✅ Node.js está instalado y actualizado
   - ✅ Tienes permisos de administrador
3. Intenta en una **carpeta nueva** (sin espacios en la ruta):
   ```powershell
   # Crear carpeta en C:\
   cd C:\
   mkdir KingsLeague
   cd KingsLeague
   # Copiar todos los archivos del proyecto aquí
   npm install
   ```

---

## 📝 Nota Importante

El error "no encuentra archivos" durante `npm install` generalmente significa:

1. **Estás en la carpeta incorrecta** (más común)
2. **Faltan archivos del proyecto** (proyecto incompleto)
3. **Problemas de permisos** (necesitas ejecutar como admin)
4. **Node.js desactualizado** (actualiza Node.js)

Sigue los pasos en orden y deberías resolverlo. Si el error persiste, copia el mensaje de error completo para diagnosticar mejor.


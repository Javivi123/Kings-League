# 📝 Crear Archivo .env en Windows desde PowerShell

Guía rápida para crear el archivo `.env` desde la terminal de Windows.

---

## ✅ Método 1: Crear con Contenido Directo (Más Rápido)

Ejecuta este comando completo en PowerShell:

```powershell
@"
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="kings-league-secret-key-2025-javier-sanchez"
"@ | Out-File -FilePath .env -Encoding utf8
```

Esto crea el archivo `.env` con todo el contenido necesario de una vez.

**Verificar que se creó:**
```powershell
Test-Path .env
# Debe devolver: True

# Ver el contenido
Get-Content .env
```

---

## ✅ Método 2: Crear Vacío y Editar

```powershell
# Crear archivo vacío
New-Item -Path .env -ItemType File

# Abrir en Bloc de notas
notepad .env
```

Luego copia y pega este contenido en el Bloc de notas:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="kings-league-secret-key-2025-javier-sanchez"
```

Guarda (Ctrl+S) y cierra el Bloc de notas.

---

## ✅ Método 3: Línea por Línea

```powershell
# Crear primera línea (sobrescribe si existe)
echo 'DATABASE_URL="file:./dev.db"' > .env

# Añadir segunda línea
echo 'NEXTAUTH_URL="http://localhost:3000"' >> .env

# Añadir tercera línea
echo 'NEXTAUTH_SECRET="kings-league-secret-key-2025-javier-sanchez"' >> .env
```

**Nota:** 
- `>` crea/sobrescribe el archivo
- `>>` añade al final del archivo

---

## ✅ Verificar que Está Correcto

Después de crear el archivo, verifica:

```powershell
# Verificar que existe
Test-Path .env
# Debe devolver: True

# Ver el contenido completo
Get-Content .env

# Debe mostrar:
# DATABASE_URL="file:./dev.db"
# NEXTAUTH_URL="http://localhost:3000"
# NEXTAUTH_SECRET="kings-league-secret-key-2025-javier-sanchez"
```

---

## ⚠️ Errores Comunes

### El archivo se guarda como .env.txt

**Problema:** Windows añade automáticamente la extensión `.txt`.

**Solución con PowerShell:**
```powershell
# Si se creó como .env.txt, renombrarlo
Rename-Item -Path .env.txt -NewName .env
```

### El contenido tiene caracteres raros

**Problema:** Encoding incorrecto.

**Solución:** Usa el Método 1 que especifica `-Encoding utf8`.

---

## 🎯 Método Recomendado (Copy-Paste)

**Copia y pega esto completo en PowerShell:**

```powershell
@"
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="kings-league-secret-key-2025-javier-sanchez"
"@ | Out-File -FilePath .env -Encoding utf8; Test-Path .env
```

Si devuelve `True`, ¡está listo! ✅


# 📊 Datos de Prueba - Kings League

## 🚀 Cómo Generar Datos de Prueba

Ejecuta el siguiente comando en una terminal donde funcione npm:

```bash
npm run db:seed
```

O manualmente:

```bash
npx tsx scripts/seed-data.ts
```

## 👥 Usuarios de Prueba Creados

Todos los usuarios tienen la contraseña: **`password123`**

### 1. Administrador
- **Email:** `admin@kingsleague.com`
- **Password:** `password123`
- **Rol:** admin
- **Nombre:** Administrador

### 2. Alumno
- **Email:** `alumno@test.com`
- **Password:** `password123`
- **Rol:** alumno
- **Nombre:** Juan Alumno

### 3. Jugador
- **Email:** `jugador@test.com`
- **Password:** `password123`
- **Rol:** jugador
- **Nombre:** Carlos Jugador
- **Nota:** Este usuario está vinculado a un jugador en la base de datos

### 4. Presidente 1
- **Email:** `presidente1@test.com`
- **Password:** `password123`
- **Rol:** presidente
- **Nombre:** Pedro Presidente
- **Equipo:** Los Leones

### 5. Presidente 2
- **Email:** `presidente2@test.com`
- **Password:** `password123`
- **Rol:** presidente
- **Nombre:** María Presidenta
- **Equipo:** Los Tigres

## 🏆 Equipos Creados

### Los Leones
- **Presidente:** Pedro Presidente
- **Euros Kings:** 1,500 €K
- **Puntos:** 15
- **Récord:** 5W - 0E - 2L
- **Goles:** 18 a favor, 8 en contra
- **Jugadores:** 9 jugadores

### Los Tigres
- **Presidente:** María Presidenta
- **Euros Kings:** 1,200 €K
- **Puntos:** 12
- **Récord:** 4W - 0E - 3L
- **Goles:** 15 a favor, 10 en contra
- **Jugadores:** 9 jugadores

## ⚽ Jugadores Creados

Se crean **20 jugadores** con:
- Nombres realistas
- Posiciones variadas (GK, DEF, MID, FWD)
- Estadísticas aleatorias (goles, asistencias, partidos, etc.)
- Algunos en equipos, otros disponibles
- Algunos en el mercado de transferencias
- Estadísticas completas (goles, asistencias, tarjetas, MVPs)

**Distribución:**
- 9 jugadores en "Los Leones"
- 9 jugadores en "Los Tigres"
- 2 jugadores disponibles (sin equipo)

## 📅 Partidos Creados

### Partido 1 (Finalizado)
- **Equipos:** Los Leones vs Los Tigres
- **Resultado:** 3 - 1 (Victoria de Los Leones)
- **Fecha:** Hace 7 días
- **MVP:** Primer jugador de Los Leones

### Partido 2 (Finalizado)
- **Equipos:** Los Tigres vs Los Leones
- **Resultado:** 2 - 2 (Empate)
- **Fecha:** Hace 14 días
- **MVP:** Primer jugador de Los Tigres

### Partido 3 (Programado)
- **Equipos:** Los Leones vs Los Tigres
- **Fecha:** En 3 días
- **Estado:** Programado

## 📰 Noticias Creadas

1. **"¡Comienza la Kings League!"**
   - Noticia de bienvenida
   - Publicada

2. **"Los Leones ganan su primer partido"**
   - Noticia sobre el primer partido
   - Publicada

## 💰 Inversiones Creadas

- Inversión de 200 €K en jugador de Los Leones
- Inversión de 150 €K en otro jugador de Los Leones
- Inversión de 180 €K en jugador de Los Tigres

## 💳 Transacciones Creadas

1. **Transacción Aprobada**
   - Equipo: Los Leones
   - Tipo: Transfer
   - Monto: 300 €K
   - Estado: Aprobada

2. **Transacción Pendiente**
   - Equipo: Los Tigres
   - Tipo: Wildcard
   - Monto: 100 €K
   - Estado: Pendiente

## 🃏 Cartas Comodín Creadas

- **Carta:** "Doble Puntos"
- **Equipo:** Los Leones
- **Precio:** 100 €K
- **Estado:** No usada

## 🔄 Re-ejecutar el Seed

Si quieres regenerar los datos de prueba:

1. **Opción 1: Mantener datos existentes**
   - El script usa `upsert`, así que no duplicará usuarios existentes
   - Puedes ejecutarlo múltiples veces de forma segura

2. **Opción 2: Limpiar y regenerar**
   - Descomenta las líneas de limpieza en `scripts/seed-data.ts`
   - Ejecuta el script nuevamente
   - ⚠️ Esto eliminará todos los datos excepto el admin

## 📝 Notas Importantes

- El script es **idempotente**: puedes ejecutarlo múltiples veces sin problemas
- Los usuarios existentes no se duplicarán (usa `upsert`)
- El admin original se mantiene si ya existe
- Los datos se generan con valores aleatorios pero realistas

## 🧪 Probar la Aplicación

Con estos datos puedes:

1. **Iniciar sesión como admin:**
   - Ver el panel de administración
   - Gestionar usuarios, equipos, jugadores

2. **Iniciar sesión como presidente:**
   - Ver tu equipo (Los Leones o Los Tigres)
   - Gestionar jugadores
   - Ver mercado de transferencias
   - Ver billetera

3. **Iniciar sesión como jugador:**
   - Ver tu perfil de jugador
   - Ver estadísticas
   - Ver tu posición en el equipo

4. **Iniciar sesión como alumno:**
   - Ver novedades
   - Ver fichas de jugadores
   - Ver clasificación

## 🐛 Solución de Problemas

Si el script falla:

1. **Verifica que la base de datos esté creada:**
   ```bash
   npx prisma migrate dev
   ```

2. **Verifica que Prisma Client esté generado:**
   ```bash
   npx prisma generate
   ```

3. **Revisa los logs del script** para ver qué falló

4. **Si hay errores de relaciones**, asegúrate de que las migraciones estén aplicadas


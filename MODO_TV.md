# 📺 Modo TV - Kings League

## 🎯 ¿Qué es el Modo TV?

El Modo TV es una vista especial de la aplicación diseñada para **proyectarse en pantallas grandes**, ChromeCast o Smart TVs en el colegio. Muestra información clave de la Kings League en un **carrusel automático** sin necesidad de interacción.

## 🚀 Acceso Rápido

### Para Admin:
1. Inicia sesión como admin
2. Ve a **Configuración** (`/settings`)
3. Busca la sección **"Modo TV / ChromeCast"** (solo visible para admin)
4. Click en el botón **"🖥️ Abrir Modo TV"**

### Acceso Directo:
Cualquiera puede abrir el modo TV directamente en:
```
http://localhost:3000/tv
```
O en producción:
```
https://tu-dominio.com/tv
```

**No requiere login** - Perfecto para proyectar en TV del colegio sin autenticación.

## 🎬 Contenido del Carrusel

El carrusel rota automáticamente cada **10 segundos** mostrando:

### 1️⃣ Clasificación (0-10s)
- Top 5 equipos
- Posiciones con colores:
  - 🥇 Dorado para el 1º
  - 🥈 Gris para el 2º
  - 🥉 Naranja para el 3º
- Puntos destacados en grande
- Logos de equipos

### 2️⃣ Próximo Partido (10-20s)
- Fecha y hora del siguiente partido
- Logos grandes de ambos equipos
- VS animado en el centro
- Diseño dramático y visual

### 3️⃣ Últimas Noticias (20-30s)
- Imagen destacada de la noticia
- Título grande
- Resumen del contenido
- Actualizado con la última noticia publicada

### 4️⃣ Mejor Jugador (30-40s)
- Jugador con más puntos fantasy
- Foto o avatar grande
- Estadísticas en grid:
  - Puntos fantasy
  - Goles
  - Asistencias
  - Partidos jugados

### 5️⃣ Jugador MVP (40-50s)
- Jugador con más MVP del partido
- Foto o avatar con efecto premium
- Contador de MVPs destacado
- Estadísticas adicionales

**Después del slide 5, vuelve automáticamente al slide 1**

## 🎨 Características de Diseño

### Textos Gigantes
- Títulos: 7xl (72px)
- Estadísticas: 6xl-9xl (60-128px)
- Subtítulos: 3xl-4xl (30-36px)
- Todo legible desde 5 metros de distancia

### Colores Vibrantes
- Fondos degradados
- Dorado, azul y rojo de Kings League
- Alto contraste
- Sombras dramáticas

### Animaciones
- Iconos con pulse y bounce
- Transiciones suaves entre slides
- Indicadores visuales
- Sin animaciones distractoras

## 🔧 Controles

### Botón de Salir
- **Ubicación:** Esquina superior derecha
- **Color:** Rojo semi-transparente
- **Función:** Vuelve a la página principal
- **Siempre visible** pero discreto

### Sin Otros Controles
- No hay navegación
- No hay menús
- No hay botones de acción
- Solo visualización

## 📱 Compatibilidad

| Dispositivo | Resolución | Estado |
|-------------|------------|--------|
| Full HD TV | 1920x1080 | ✅ Optimizado |
| 4K TV | 3840x2160 | ✅ Compatible |
| ChromeCast | Variable | ✅ Compatible |
| Smart TV | 1080p+ | ✅ Perfecto |
| Proyector | 1080p+ | ✅ Óptimo |

## 🎯 Casos de Uso

### En el Colegio
- Proyectar en TV durante recreos
- Mostrar clasificación en tiempo real
- Promocionar próximos partidos
- Destacar jugadores estrella

### Durante Eventos
- Ceremonia de premios
- Día de la Kings League
- Presentaciones de equipos
- Eventos deportivos

### En Clase
- Proyectar estadísticas
- Enseñar análisis deportivo
- Motivar participación

## ⚙️ Configuración Recomendada

### Para ChromeCast
1. Abre Chrome en tu ordenador
2. Ve a `http://localhost:3000/tv`
3. Click en el icono de Cast
4. Selecciona tu ChromeCast
5. ¡Listo! El carrusel se proyecta automáticamente

### Para Smart TV
1. Abre el navegador de la Smart TV
2. Navega a la URL del modo TV
3. Pon la TV en modo pantalla completa (F11)
4. El carrusel funcionará automáticamente

### Para Proyector
1. Conecta el ordenador al proyector
2. Abre el modo TV en el navegador
3. F11 para pantalla completa
4. Deja que el carrusel rote solo

## 🔄 Actualizar Contenido

El contenido se actualiza **en tiempo real** desde la base de datos:
- Clasificación muestra posiciones actuales
- Próximo partido es el siguiente programado
- Noticias muestra la última publicada
- Jugadores muestran estadísticas actuales

**Para refresh:** Simplemente recarga la página (F5)

## ⚠️ Notas Importantes

### Datos Vacíos
Si no hay datos para mostrar en un slide:
- Se muestra un mensaje amigable
- El carrusel continúa rotando
- No se rompe la experiencia

### Sin Internet
- La página requiere conexión para cargar
- Una vez cargada, funciona con los datos en cache
- Recarga periódica recomendada para datos actualizados

### Rendimiento
- Optimizado para proyección continua
- Sin memory leaks
- Intervalos limpios correctamente
- Puede funcionar horas sin problemas

## 🎓 Solo para Admin

El botón para acceder al Modo TV en Settings **solo es visible para administradores**:

```typescript
{session?.user?.role === "admin" && (
  // Botón de Modo TV
)}
```

**Razón:** Solo los admins deben controlar cuándo proyectar en la TV del colegio.

**Pero:** Cualquiera puede acceder a `/tv` directamente (útil para que se proyecte sin login).

## 🆕 Mejoras Futuras (Opcionales)

- [ ] Añadir slide de últimos goleadores
- [ ] Slide de próximos eventos/calendario
- [ ] Contador de tiempo hasta próximo partido
- [ ] Animaciones de transición entre slides
- [ ] Control remoto con teclado (flechas)
- [ ] Configurar tiempo por slide desde admin
- [ ] QR code para descargar la app
- [ ] Refresh automático de datos cada X minutos

## 🐛 Solución de Problemas

### El carrusel no rota
- Verifica que JavaScript esté habilitado
- Revisa la consola del navegador
- Recarga la página

### No se muestran datos
- Verifica que haya datos en la base de datos
- Ejecuta `npm run db:seed` si es necesario
- Revisa las APIs en `/api/teams`, `/api/matches`, etc.

### Textos muy pequeños
- El modo TV está optimizado para Full HD (1920x1080)
- Si la pantalla es menor, los textos se verán muy grandes
- Es normal - está diseñado para TVs

### Salir del modo TV
- Click en el botón X rojo (esquina superior derecha)
- O navega directamente a `/` en la URL

---

**Última actualización:** Noviembre 2025
**Versión:** 2.0 - Carrusel Automático
**Estado:** ✅ Producción


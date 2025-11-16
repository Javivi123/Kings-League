# ⚡ Guía Rápida - Kings League

## 🚀 Comandos Esenciales

```bash
# Iniciar servidor de desarrollo
npm run dev

# Ver base de datos
npm run db:studio

# Crear usuario admin
npm run db:create-admin

# Generar datos de prueba
npm run db:seed

# Resetear tutorial para todos
npm run db:reset-tutorial
```

## 🔑 Credenciales de Prueba

**Admin:**
- Email: `admin@kingsleague.com`
- Password: `Admin123!` o `password123`

**Otros usuarios:** Ver `DATOS_PRUEBA.md`

## 📺 Modo TV

### Acceso Admin:
1. Login como admin
2. Ve a `/settings`
3. Click en "🖥️ Abrir Modo TV"

### Acceso Directo:
```
http://localhost:3000/tv
```

**Características:**
- Carrusel automático (10s por slide)
- 5 slides: Clasificación, Partido, Noticias, Mejor Jugador, MVP
- Solo botón de salir
- Optimizado para Full HD/4K

## 🎨 Tutorial Interactivo

- Se muestra **una vez por usuario** al primer login
- Guardado en base de datos (no localStorage)
- 8 pasos explicativos
- Confetti al completar 🎉

## 📁 Estructura de Archivos Importantes

```
app/
├── tv/page.tsx              # Modo TV con carrusel
├── api/
│   ├── teams/route.ts       # API de equipos
│   ├── matches/route.ts     # API de partidos
│   ├── news/route.ts        # API de noticias
│   └── players/route.ts     # API de jugadores
└── settings/page.tsx        # Botón de Modo TV

components/
├── tutorial/Tutorial.tsx    # Tutorial guiado
├── ui/
│   ├── FloatingIcons.tsx   # Iconos flotantes
│   └── SparkleEffect.tsx   # Destellos animados
└── layout/
    ├── Navbar.tsx          # Navegación
    └── Footer.tsx          # © Javier Sánchez
```

## 🎯 Páginas con Decoraciones

| Página | Efecto | Cantidad |
|--------|--------|----------|
| `/login` | Coronas flotantes | 8 |
| `/` (Home) | Sparkle effect | 20 destellos |
| `/hall-of-fame` | Trofeos flotantes | 10 |
| `/players` | Estrellas flotantes | 8 |
| `/dashboard` | Iconos mixtos | 8 |

## 🔐 Rutas por Rol

### Públicas (sin login)
- `/`, `/login`, `/teams`, `/standings`, `/players`, `/news`, `/tv`

### Admin
- `/admin/*`

### Presidente
- `/my-team`, `/transfers`, `/wallet`, `/agenda`

### Jugador
- `/my-profile`

## 🐛 Solución Rápida de Problemas

### Modo TV no carga datos
```bash
npm run db:seed  # Generar datos de prueba
```

### Tutorial no aparece para usuario
```bash
# Opción 1: Usar Prisma Studio
npm run db:studio
# Cambiar hasSeenTutorial a false

# Opción 2: Resetear todos
npm run db:reset-tutorial
```

### Error de migración
```bash
npx prisma migrate dev
npx prisma generate
```

### Servidor no inicia
```bash
# Verificar puerto 3000
lsof -ti:3000 | xargs kill -9

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

## 📊 Estadísticas del Proyecto

- **Páginas:** 28+
- **Componentes:** 15+
- **API Routes:** 18+
- **Modelos BD:** 17
- **Animaciones CSS:** 12
- **Scripts útiles:** 5

## 🎨 Colores Principales

```css
Red:    #DC2626  (red-kings)
Blue:   #2563EB  (blue-kings)
Gold:   #F59E0B  (gold-kings)
Black:  #000000  (black-kings)
White:  #FFFFFF  (white-kings)
```

## 📝 Documentos Importantes

- `README.md` - Intro general
- `SETUP.md` - Guía de instalación
- `MODO_TV.md` - Guía completa del Modo TV
- `RESUMEN_COMPLETO_SESION.md` - Historia completa
- `DATOS_PRUEBA.md` - Usuarios de prueba
- `ADMIN_CREDENTIALS.md` - Acceso admin

## ⚡ Tips Rápidos

- **F11** en navegador = Pantalla completa (ideal para TV)
- **Ctrl+Shift+R** = Recarga forzada
- **Prisma Studio** = `npm run db:studio` → `localhost:5555`
- **Logs del servidor** = Visibles en terminal donde ejecutas `npm run dev`

## 🎯 Próxima Sesión

Si continúas en otro chat, menciona:
1. ✅ Modo TV completamente rediseñado en `/tv`
2. ✅ Tutorial vinculado a usuarios (BD)
3. ✅ Decoraciones flotantes añadidas
4. ✅ Todas las mejoras visuales aplicadas

---

**Última actualización:** Noviembre 2025
**Todo funcional:** ✅
**Listo para:** Producción 🚀


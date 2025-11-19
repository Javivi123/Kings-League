# Kings League - Cumbres School

Aplicación de fantasy league para la Kings League del colegio.

## 🎯 Características

- ✅ Sistema de usuarios con roles (Alumno, Jugador, Presidente, Admin)
- ✅ Control de jugadores y equipos
- ✅ Gestión de partidos y marcadores
- ✅ Sistema de transferencias y subastas
- ✅ Sistema de compra/venta con "Euros Kings"
- ✅ Cartas comodín
- ✅ Modo TV para ChromeCast
- ✅ Diseño responsive (iPhone, iPad, Android, Desktop)

## 🛠️ Tecnologías

- **Next.js 14** - Framework React full-stack
- **TypeScript** - Tipado estático
- **Prisma** - ORM para base de datos
- **NextAuth.js** - Autenticación
- **Tailwind CSS** - Estilos
- **Lucide React** - Iconos
- **React Hot Toast** - Notificaciones

## 🎨 Colores

- **Rojo**: `#DC2626` (red-kings)
- **Azul**: `#2563EB` (blue-kings)
- **Dorado**: `#F59E0B` (gold-kings)
- **Negro**: `#000000` (black-kings)
- **Blanco**: `#FFFFFF` (white-kings)

## 📦 Instalación

### Para Mac/Linux:
```bash
# 1. Instalar dependencias
npm install

# 2. Crear archivo .env (copia .env.example)
cp .env.example .env

# 3. Configurar variables de entorno en .env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secret-key-aqui"

# 4. Generar cliente de Prisma
npx prisma generate

# 5. Crear base de datos y ejecutar migraciones
npx prisma migrate dev --name init

# 6. (Opcional) Abrir Prisma Studio para ver la base de datos
npx prisma studio
```

### Para Windows:
📖 **Ver guía completa:** [`SETUP_WINDOWS.md`](./SETUP_WINDOWS.md)

**Resumen rápido:**
1. Instalar Node.js desde https://nodejs.org/
2. Abrir PowerShell en la carpeta del proyecto
3. Ejecutar: `npm install`
4. Crear archivo `.env` manualmente (ver SETUP_WINDOWS.md)
5. Ejecutar: `npx prisma generate`
6. Ejecutar: `npx prisma migrate dev --name init`
7. Ejecutar: `npm run db:create-admin`
8. Ejecutar: `npm run dev`

## 🚀 Desarrollo

**⚠️ IMPORTANTE:** Usa `npm run dev`, NO `npx run dev`

```bash
npm run dev
```

**Nota:** `npx run dev` intentará instalar un paquete inexistente llamado "run" y fallará. El comando correcto es `npm run dev` porque ejecuta el script "dev" definido en `package.json`.

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
├── app/                    # App Router de Next.js
│   ├── api/               # API routes
│   ├── login/             # Página de login
│   ├── register/          # Página de registro
│   ├── settings/          # Configuración
│   └── page.tsx           # Página principal
├── components/            # Componentes React
│   ├── layout/           # Navbar, Footer
│   ├── home/             # Componentes de inicio
│   └── ui/               # Componentes UI reutilizables
├── lib/                  # Utilidades y configuraciones
│   ├── auth.ts           # Configuración NextAuth
│   ├── prisma.ts         # Cliente Prisma
│   └── utils.ts          # Utilidades
├── prisma/               # Schema y migraciones
│   └── schema.prisma     # Schema de base de datos
└── types/                # Tipos TypeScript
```

## 👥 Roles de Usuario

### Alumno
- Ver novedades
- Ver fichas de jugadores
- Ver clasificación de la liga
- Ver partidos y resultados

### Jugador
- Todo lo de Alumno
- Ver su propia ficha
- Ver sus estadísticas
- Ver panel de su equipo
- Ver dinero invertido en él
- Ver clasificación dentro de su equipo
- Ver próximos partidos
- Ver su valor de mercado

### Presidente de Equipo
- Todo lo de Alumno
- Gestionar jugadores del equipo
- Ver estadísticas del equipo
- Comprar/vender jugadores (subastas)
- Gestionar dinero (Euros Kings)
- Solicitar cartas comodín
- Ver agenda (partidos, reuniones)
- Registrar equipo con logo y nombre

### Admin
- Control total de la aplicación
- Generar fichas de jugadores, equipos, presidentes
- Gestionar cuentas
- Bandeja de solicitudes
- Revisar transacciones
- Control de subasta inicial

## 📱 Modo TV

El modo TV se activa desde la página de Configuración y optimiza la visualización para pantallas grandes y ChromeCast. Aumenta el tamaño de fuente y espaciado para mejor legibilidad a distancia.

## 🔐 Seguridad

- Contraseñas hasheadas con bcrypt
- Autenticación con NextAuth.js
- Protección de rutas por rol
- Validación de datos con Zod

## 📝 Funcionalidades Implementadas

- ✅ Sistema completo de usuarios con 4 roles
- ✅ Gestión de equipos, jugadores y partidos
- ✅ Sistema de transferencias y mercado
- ✅ Sistema de notificaciones
- ✅ Dashboard personalizado por rol
- ✅ Modo TV con carrusel automático
- ✅ Sistema de solicitudes (wildcards)
- ✅ Gestión de transacciones
- ✅ Vista detallada de partidos (goles, tarjetas, alineaciones, estadísticas)
- ✅ Exportar/Importar datos
- ✅ Sistema de logros y Hall of Fame
- ✅ Tutorial interactivo para nuevos usuarios
- ✅ Animaciones optimizadas

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Iniciar servidor desarrollo
npm run build            # Build producción
npm run start            # Iniciar producción

# Base de datos
npm run db:open          # Abrir Prisma Studio
npm run db:create-admin  # Crear usuario admin
npm run db:seed          # Generar datos de prueba
npm run db:reset-tutorial # Resetear tutorial de usuarios
npm run db:reset-password # Resetear contraseña de usuario
```

## 📖 Documentación

- **SETUP.md** - Guía de configuración paso a paso
- **SETUP_WINDOWS.md** - Guía específica para Windows
- **ADMIN_CREDENTIALS.md** - Credenciales y gestión de usuarios
- **RESETEAR_CONTRASEÑA.md** - Cómo resetear contraseñas
- **RESUMEN_COMPLETO_SESION.md** - Documentación completa del proyecto

## 🤝 Contribuir

Este es un proyecto de Javier Sánchez. Para contribuir, contacta con el colegio.

## 📄 Licencia

Proyecto privado de Javier Sánchez y Cumbres School.

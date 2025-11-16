# Kings League - Fantasy League App

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

## 🚀 Desarrollo

```bash
npm run dev
```

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

## 📝 Próximos Pasos

- [ ] Implementar páginas específicas por rol
- [ ] Sistema de notificaciones
- [ ] Chat entre usuarios
- [ ] Estadísticas avanzadas
- [ ] Exportar datos

## 🤝 Contribuir

Este es un proyecto de Javier Sánchez. Para contribuir, contacta con el colegio.

## 📄 Licencia

Proyecto privado de Javier Sánchez y Cumbres School.

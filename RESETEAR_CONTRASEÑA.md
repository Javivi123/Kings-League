# 🔑 Reseteo de Contraseñas - Kings League

## ⚠️ Importante

Las contraseñas en la base de datos están **hasheadas con bcrypt**, lo que significa que:
- **NO se pueden deshashear** (es unidireccional por seguridad)
- **NO puedes ver la contraseña original**
- Solo puedes **resetear** la contraseña estableciendo una nueva

## 🛠️ Cómo Resetear una Contraseña

### Método 1: Script Interactivo (Recomendado)

Ejecuta el script sin argumentos y te guiará paso a paso:

```bash
npm run db:reset-password
```

El script te pedirá:
1. El email del usuario
2. La nueva contraseña (mínimo 6 caracteres)
3. Confirmación de la nueva contraseña

### Método 2: Con Argumentos

Puedes proporcionar el email y la contraseña directamente:

```bash
npm run db:reset-password <email> <nueva-contraseña>
```

**Ejemplo:**
```bash
npm run db:reset-password usuario@ejemplo.com nuevaPassword123
```

### Método 3: Directamente con Node

```bash
node scripts/reset-password.js <email> [nueva-contraseña]
```

## 📋 Ejemplo Completo

```bash
$ npm run db:reset-password
📧 Ingresa el email del usuario: usuario@ejemplo.com

👤 Usuario encontrado:
   - Nombre: Juan Usuario
   - Email: usuario@ejemplo.com
   - Rol: alumno

🔑 Ingresa la nueva contraseña (mínimo 6 caracteres): miNuevaPass123
🔑 Confirma la nueva contraseña: miNuevaPass123

🔄 Hasheando nueva contraseña...
✅ Contraseña actualizada exitosamente!

📝 El usuario "Juan Usuario" ahora puede iniciar sesión con la nueva contraseña.
```

## 🔒 Seguridad

- El script valida que la contraseña tenga al menos 6 caracteres
- La contraseña se hashea con bcrypt (10 rounds) antes de guardarse
- Solo puedes resetear contraseñas, no ver las existentes
- El usuario debe iniciar sesión con la nueva contraseña después del reset

## ❌ Errores Comunes

### "No se encontró un usuario con el email"
- Verifica que el email esté escrito correctamente
- Puedes ver todos los usuarios en Prisma Studio: `npm run db:open`

### "La contraseña debe tener al menos 6 caracteres"
- Asegúrate de que la nueva contraseña tenga mínimo 6 caracteres

### "Las contraseñas no coinciden"
- Verifica que hayas escrito la misma contraseña en ambos campos

## 📝 Notas

- El script actualiza directamente la base de datos
- No necesitas reiniciar el servidor después de resetear una contraseña
- El usuario puede iniciar sesión inmediatamente con la nueva contraseña
- Si olvidaste el email del usuario, puedes buscarlo en Prisma Studio

## 🔍 Ver Usuarios en la Base de Datos

Si necesitas ver todos los usuarios para encontrar el email:

```bash
npm run db:open
```

Luego navega a la tabla "User" y busca el usuario por nombre o email.


# 📚 Sistema de Tutorial - Kings League

## Cómo Funciona

El tutorial se muestra **una vez por usuario** (no por navegador) cuando inician sesión por primera vez.

### Características

✅ **Por Usuario**: Vinculado al email/ID del usuario en la base de datos
✅ **Multi-dispositivo**: El usuario no vuelve a ver el tutorial en otro navegador
✅ **Persistente**: Estado guardado en la BD, no en localStorage del navegador
✅ **Multi-usuario**: Varios usuarios pueden usar el mismo navegador y cada uno verá el tutorial

### Estado en Base de Datos

El campo `hasSeenTutorial` en el modelo User:
- **`false`** (por defecto): El usuario verá el tutorial
- **`true`**: El usuario ya vio el tutorial y no se mostrará de nuevo

## Resetear Tutorial (Para Testing)

Si quieres que todos los usuarios vean el tutorial de nuevo (útil para testing o después de cambios importantes):

```bash
npm run db:reset-tutorial
```

Este comando establece `hasSeenTutorial = false` para todos los usuarios.

### Resetear para un Usuario Específico

Si solo quieres resetear el tutorial para un usuario específico, usa Prisma Studio:

```bash
npm run db:studio
```

1. Ve a la tabla `users`
2. Busca el usuario
3. Cambia `hasSeenTutorial` a `false`
4. Guarda los cambios

## Flujo del Tutorial

1. **Usuario nuevo se registra** → `hasSeenTutorial = false` automáticamente
2. **Usuario hace login** → NextAuth carga el estado desde la BD
3. **Tutorial se muestra** → Solo si `hasSeenTutorial === false`
4. **Usuario completa u omite tutorial** → Se actualiza a `true` en la BD
5. **Próximos logins** → Tutorial no se muestra (ya visto)

## Archivos Relacionados

- `prisma/schema.prisma` - Campo `hasSeenTutorial` en modelo User
- `components/tutorial/Tutorial.tsx` - Componente del tutorial
- `app/api/tutorial/complete/route.ts` - API para marcar como completado
- `lib/auth.ts` - Incluye el campo en la sesión de NextAuth
- `scripts/reset-tutorial.js` - Script para resetear el tutorial

## Personalizar el Tutorial

Para modificar el contenido del tutorial, edita el array `tutorialSteps` en:
```
components/tutorial/Tutorial.tsx
```

Cada paso tiene:
- `title`: Título del paso (con emoji)
- `description`: Descripción explicativa
- `position`: Posición del tooltip (opcional)

## Nota Importante

⚠️ Los usuarios existentes **antes** de esta actualización tienen `hasSeenTutorial = false` por defecto, así que verán el tutorial la primera vez que inicien sesión después de la actualización.

Si quieres marcar a todos los usuarios existentes como que ya vieron el tutorial (para que no les aparezca):

```bash
# Abre Prisma Studio
npm run db:studio

# O usa SQL directamente:
# UPDATE users SET hasSeenTutorial = true WHERE createdAt < '2025-11-16';
```


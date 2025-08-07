# Configuración de Bases de Datos - Desarrollo y Producción

## Configuración de Variables de Entorno

### Desarrollo
Para usar una base de datos específica de desarrollo, configura:
```bash
DATABASE_URL_DEV=postgresql://usuario:password@host:puerto/database_dev
```

### Producción  
Para usar una base de datos específica de producción, configura:
```bash
DATABASE_URL_PROD=postgresql://usuario:password@host:puerto/database_prod
```

### Fallback
Si no se configuran las variables específicas, el sistema usará `DATABASE_URL` como fallback.

## Variables de Entorno Disponibles

En el proyecto hay múltiples formas de configurar las bases de datos:

1. **DATABASE_URL** - Base de datos por defecto (actual)
2. **DATABASE_URL_DEV** - Base de datos específica para desarrollo
3. **DATABASE_URL_PROD** - Base de datos específica para producción

## Comandos para Migraciones

### Migraciones en Desarrollo
```bash
NODE_ENV=development npm run db:push
```

### Migraciones en Producción
```bash
NODE_ENV=production npm run db:push
```

## Comportamiento del Sistema

### Desarrollo (NODE_ENV=development o no definido)
- Prioridad: DATABASE_URL_DEV → DATABASE_URL
- Mensaje en consola: "🔧 Conectando a base de datos de DESARROLLO"

### Producción (NODE_ENV=production)
- Prioridad: DATABASE_URL_PROD → DATABASE_URL  
- Mensaje en consola: "🚀 Conectando a base de datos de PRODUCCIÓN"

## Configuración en Replit

### Para configurar en Replit:

1. **Panel de Secrets**: Agrega las variables de entorno en el panel de secrets
2. **Archivo .env**: También puedes configurar en el archivo .env local

Ejemplo de configuración:
```env
# Base de datos actual (desarrollo)
DATABASE_URL=postgresql://...

# Base de datos específica de desarrollo  
DATABASE_URL_DEV=postgresql://...

# Base de datos específica de producción
DATABASE_URL_PROD=postgresql://...
```

## Ventajas de esta Configuración

✅ **Separación clara** entre entornos
✅ **Fallback automático** a DATABASE_URL si no hay específicas
✅ **Logs informativos** para saber qué base de datos se está usando
✅ **Compatible** con deployments de Replit
✅ **Flexibilidad** para usar una o múltiples bases de datos

## Información de Entorno Disponible

El módulo `server/db.ts` exporta `dbEnvironment` con:
- `environment`: 'development' | 'production'
- `isDevelopment`: boolean
- `isProduction`: boolean  
- `databaseUrl`: string (con password oculto para logs)
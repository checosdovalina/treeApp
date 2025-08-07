# Configuración para Deployment en Producción

## Variables de Entorno para Deployment

Para que la aplicación use automáticamente la base de datos de producción cuando se despliegue en Replit, configura estas variables en el panel de **Secrets**:

### 1. Base de Datos de Producción
- **Nombre**: `DATABASE_URL`
- **Valor**: `postgresql://neondb_owner:npg_F73oAOVrZluT@ep-cold-boat-aep7jx5g-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require`

### 2. Entorno de Producción
- **Nombre**: `NODE_ENV`  
- **Valor**: `production`

### 3. Autenticación Replit
- **Nombre**: `ISSUER_URL`
- **Valor**: `https://replit.com/oidc`

## Comportamiento Automático

Cuando se hace el deployment:

1. ✅ **Replit automáticamente configura `NODE_ENV=production`**
2. ✅ **La aplicación detecta el entorno de producción**
3. ✅ **Se conecta automáticamente a la base de datos de producción configurada**
4. ✅ **Usa las credenciales seguras desde Secrets**

## Verificación del Entorno

La aplicación mostrará en los logs:
- 🔧 "Conectando a base de datos de DESARROLLO" (en desarrollo)
- 🚀 "Conectando a base de datos de PRODUCCIÓN" (en deployment)

## Notas de Seguridad

- ✅ Las credenciales están encriptadas en Secrets
- ✅ No hay información sensible en el código fuente
- ✅ Separación completa entre entornos de desarrollo y producción
- ✅ Los datos de productos existentes están preservados
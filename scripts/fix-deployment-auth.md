# Solución para Error de Autenticación en Deployment

## 🔍 Problema Identificado

La aplicación funciona en desarrollo pero falla con error 401 en el ambiente deployado. El problema es que los secrets de Replit Auth no están configurados correctamente para producción.

## ✅ Diagnóstico Actual

**Variables de entorno en desarrollo:**
- `REPLIT_DOMAINS`: 878dd31b-697c-4d4f-ac37-cf8003e4f7cf-00-17t113r8g6ozf.worf.replit.dev
- `ISSUER_URL`: NO CONFIGURADO
- `SESSION_SECRET`: ✅ CONFIGURADO

**Dominio en producción:**
- `inventory-tracker-checodovalina.replit.app`

## 📋 Solución Requerida

Para que la autenticación funcione en el ambiente deployado, configura estos secrets en el panel de **Secrets** de Replit:

### 1. ISSUER_URL
```
https://replit.com/oidc
```

### 2. REPLIT_DOMAINS (actualizar)
```
inventory-tracker-checodovalina.replit.app
```

*Nota: Replit automáticamente gestiona los dominios, pero asegúrate de que el dominio de producción esté incluido.*

### 3. Verificar que estén configurados:
- ✅ `SESSION_SECRET` (ya configurado)
- ✅ `REPL_ID` (ya configurado automáticamente)
- ❌ `ISSUER_URL` (necesita configuración)
- ❌ `REPLIT_DOMAINS` (necesita incluir dominio de producción)

## 🚀 Después de Configurar

1. Los secrets se sincronizarán automáticamente con el deployment
2. La autenticación funcionará tanto en desarrollo como en producción
3. Los usuarios podrán hacer login exitosamente

## 🔧 Verificación

Una vez configurados los secrets, la aplicación debe mostrar en los logs:
```
🌐 REPLIT_DOMAINS configurados: inventory-tracker-checodovalina.replit.app
📝 Registrando estrategia para dominio: inventory-tracker-checodovalina.replit.app
🔐 Intento de login desde: inventory-tracker-checodovalina.replit.app
🔑 Estrategias disponibles: replitauth:inventory-tracker-checodovalina.replit.app
```

## ⚠️ Importante

- No modifiques código - el problema es únicamente de configuración de secrets
- Los secrets se aplican automáticamente al deployment
- La base de datos de producción ya está configurada correctamente
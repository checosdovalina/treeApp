import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Determinar el entorno y la URL de base de datos correspondiente
// En deployment, Replit automáticamente configura NODE_ENV=production
const environment = process.env.NODE_ENV || 'development';
let databaseUrl: string;

if (environment === 'production') {
  // En producción, usar DATABASE_URL_PROD si está disponible, sino usar DATABASE_URL
  databaseUrl = process.env.DATABASE_URL_PROD || process.env.DATABASE_URL || '';
  console.log('🚀 Conectando a base de datos de PRODUCCIÓN');
} else {
  // En desarrollo, usar DATABASE_URL_DEV si está disponible, sino usar DATABASE_URL
  databaseUrl = process.env.DATABASE_URL_DEV || process.env.DATABASE_URL || '';
  console.log('🔧 Conectando a base de datos de DESARROLLO');
}

if (!databaseUrl) {
  throw new Error(
    `DATABASE_URL no configurada para el entorno: ${environment}. ` +
    'Configura DATABASE_URL_DEV para desarrollo y DATABASE_URL_PROD para producción.'
  );
}

export const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle({ client: pool, schema });

// Exportar información del entorno para uso en otras partes de la aplicación
export const dbEnvironment = {
  environment,
  isDevelopment: environment === 'development',
  isProduction: environment === 'production',
  databaseUrl: databaseUrl.replace(/:[^:@]*@/, ':****@') // Ocultar password en logs
};
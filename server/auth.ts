import bcrypt from 'bcryptjs';
import { storage } from './storage';
import type { LocalUser, InsertLocalUser } from '@shared/schema';

export interface AuthService {
  login(username: string, password: string): Promise<{ user: LocalUser; success: boolean }>;
  createUser(userData: InsertLocalUser): Promise<LocalUser>;
  hashPassword(password: string): Promise<string>;
  verifyPassword(password: string, hashedPassword: string): Promise<boolean>;
}

class LocalAuthService implements AuthService {
  async login(username: string, password: string): Promise<{ user: LocalUser; success: boolean }> {
    const user = await storage.getLocalUserByUsername(username);
    
    if (!user || !user.isActive) {
      return { user: null as any, success: false };
    }
    
    const isValidPassword = await this.verifyPassword(password, user.password);
    
    if (!isValidPassword) {
      return { user: null as any, success: false };
    }
    
    // Update last login
    await storage.updateLocalUserLastLogin(user.id);
    
    return { user, success: true };
  }
  
  async createUser(userData: InsertLocalUser): Promise<LocalUser> {
    // Hash the password before storing
    const hashedPassword = await this.hashPassword(userData.password);
    
    const userToCreate = {
      ...userData,
      password: hashedPassword,
    };
    
    return await storage.createLocalUser(userToCreate);
  }
  
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }
  
  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}

export const authService = new LocalAuthService();

// Function to create default admin user
export async function createDefaultAdmin() {
  try {
    const existingAdmin = await storage.getLocalUserByUsername('admin');
    
    if (!existingAdmin) {
      const adminUser: InsertLocalUser = {
        username: 'admin',
        password: 'admin123', // Will be hashed by createUser
        email: 'admin@uniformesla.com',
        firstName: 'Administrador',
        lastName: 'Sistema',
        role: 'admin',
        isActive: true,
      };
      
      const createdAdmin = await authService.createUser(adminUser);
      console.log('✓ Usuario admin creado exitosamente');
      console.log('  Username: admin');
      console.log('  Password: admin123');
      
      return createdAdmin;
    } else {
      console.log('Usuario admin ya existe');
      return existingAdmin;
    }
  } catch (error) {
    console.error('Error creando usuario admin:', error);
    throw error;
  }
}
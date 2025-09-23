import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { authService, createDefaultAdmin } from "./auth";
import session from "express-session";
import connectPg from "connect-pg-simple";

// Admin middleware
const isAdmin = async (req: any, res: any, next: any) => {
  try {
    // Check if user is authenticated
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      // Check for admin test user
      const adminUser = await storage.getUser('admin-test');
      if (adminUser && adminUser.role === 'admin') {
        return next();
      }
      return res.status(401).json({ message: "Authentication required" });
    }

    const userId = req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "User ID not found" });
    }

    const user = await storage.getUser(userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    next();
  } catch (error) {
    console.error("Error in admin middleware:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
import { 
  insertProductSchema, 
  insertCategorySchema,
  insertBrandSchema,
  insertSizeSchema,
  insertColorSchema,
  insertGarmentTypeSchema,
  insertSizeRangeSchema,
  insertOrderSchema,
  insertOrderItemSchema,
  insertQuoteSchema,
  insertProductColorImageSchema,
  insertPromotionSchema,
  insertIndustrySectionSchema,
  insertCompanySchema,
  insertCompanyTypeSchema,
  insertProductPricingSchema,
  insertContactMessageSchema,
  customerRegistrationSchema,
  quoteRequestSchema,
  sizeRanges,
  loginSchema,
  adminRegistrationSchema,
  type InsertLocalUser
} from "@shared/schema";
import { z } from "zod";
import { db } from "./db";
import { eq, and } from "drizzle-orm";



// Local authentication middleware
const isLocallyAuthenticated = (req: any, res: any, next: any) => {
  if (req.session && req.session.user) {
    return next();
  }
  return res.status(401).json({ message: "Authentication required" });
};

const isLocalAdmin = (req: any, res: any, next: any) => {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: "Admin access required" });
};

// PDF HTML generator functions
function generateOrderPDFHTML(order: any): string {
  const shippingAddress = typeof order.shippingAddress === 'string' 
    ? JSON.parse(order.shippingAddress) 
    : order.shippingAddress || {};
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Pedido ${order.orderNumber}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .header {
          border-bottom: 3px solid #1F4287;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .company-name {
          font-size: 28px;
          font-weight: bold;
          color: #1F4287;
          margin-bottom: 5px;
        }
        .order-info {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        .order-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 15px;
          color: #1F4287;
        }
        .products-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        .products-table th,
        .products-table td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        .products-table th {
          background-color: #1F4287;
          color: white;
          font-weight: bold;
        }
        .products-table tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .total-section {
          text-align: right;
          margin-top: 20px;
        }
        .total-final {
          font-size: 20px;
          font-weight: bold;
          border-top: 2px solid #1F4287;
          padding-top: 10px;
          color: #1F4287;
        }
        .address-section {
          background: #e3f2fd;
          border: 1px solid #90caf9;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
        }
        .two-column {
          display: flex;
          gap: 30px;
        }
        .column {
          flex: 1;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-name">TREE Uniformes & Kodiak Industrial</div>
      </div>

      <div class="order-info">
        <div class="order-title">Pedido ${order.orderNumber}</div>
        <div class="two-column">
          <div class="column">
            <p><strong>Cliente:</strong> ${order.customerName || 'No disponible'}</p>
            <p><strong>Email:</strong> ${order.customerEmail || 'No disponible'}</p>
            <p><strong>Teléfono:</strong> ${order.customerPhone || 'No disponible'}</p>
          </div>
          <div class="column">
            <p><strong>Fecha:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Estado:</strong> ${order.status === 'pending' ? 'Pendiente' : order.status}</p>
          </div>
        </div>
      </div>

      ${shippingAddress && Object.keys(shippingAddress).length > 0 ? `
        <div class="address-section">
          <strong>Dirección de Envío:</strong><br>
          ${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}<br>
          ${shippingAddress.address || ''}<br>
          ${shippingAddress.city || ''}, ${shippingAddress.state || ''} ${shippingAddress.zipCode || ''}
        </div>
      ` : ''}

      <table class="products-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Talla</th>
            <th>Color</th>
            <th>Cantidad</th>
            <th>Precio Unit.</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${order.items?.map((item: any) => `
            <tr>
              <td>${item.productName || 'Producto'}</td>
              <td>${item.size || '-'}</td>
              <td>${item.color || '-'}</td>
              <td>${item.quantity}</td>
              <td>$${parseFloat(item.unitPrice || 0).toFixed(2)}</td>
              <td>$${parseFloat(item.totalPrice || 0).toFixed(2)}</td>
            </tr>
          `).join('') || ''}
        </tbody>
      </table>

      ${order.notes ? `
        <div class="address-section">
          <strong>Notas del Pedido:</strong><br>
          ${order.notes}
        </div>
      ` : ''}

      <div class="total-section">
        <p>Subtotal: $${parseFloat(order.subtotal || 0).toFixed(2)}</p>
        <p>Envío: $${parseFloat(order.shipping || 0).toFixed(2)}</p>
        <p>IVA: $${parseFloat(order.tax || 0).toFixed(2)}</p>
        <div class="total-final">Total: $${parseFloat(order.total || 0).toFixed(2)}</div>
      </div>
    </body>
    </html>
  `;
}

function generateQuotePDFHTML(quote: any): string {
  const items = Array.isArray(quote.items) ? quote.items : JSON.parse(quote.items || '[]');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Presupuesto ${quote.quoteNumber}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .header {
          border-bottom: 3px solid #1F4287;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .company-name {
          font-size: 28px;
          font-weight: bold;
          color: #1F4287;
          margin-bottom: 5px;
        }
        .quote-info {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        .quote-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 15px;
          color: #1F4287;
        }
        .products-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        .products-table th,
        .products-table td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        .products-table th {
          background-color: #1F4287;
          color: white;
          font-weight: bold;
        }
        .products-table tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .total-section {
          text-align: right;
          margin-top: 20px;
        }
        .total-final {
          font-size: 20px;
          font-weight: bold;
          border-top: 2px solid #1F4287;
          padding-top: 10px;
          color: #1F4287;
        }
        .notes-section {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-name">TREE Uniformes & Kodiak Industrial</div>
      </div>

      <div class="quote-info">
        <div class="quote-title">Presupuesto ${quote.quoteNumber}</div>
        <p><strong>Cliente:</strong> ${quote.customerName || 'Cliente ' + quote.customerId}</p>
        <p><strong>Email:</strong> ${quote.customerEmail || 'No disponible'}</p>
        <p><strong>Fecha:</strong> ${new Date(quote.createdAt).toLocaleDateString('es-ES')}</p>
      </div>

      <h3>Productos Cotizados</h3>
      <table class="products-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Talla</th>
            <th>Color</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${items.map((item: any) => `
            <tr>
              <td>${item.productName}</td>
              <td>${item.size || 'N/A'}</td>
              <td>${item.color || 'N/A'}</td>
              <td>${item.quantity}</td>
              <td>$${item.unitPrice}</td>
              <td>$${item.total}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      ${quote.notes ? `
        <div class="notes-section">
          <strong>Notas del Administrador:</strong><br>
          ${quote.notes}
        </div>
      ` : ''}

      <div class="total-section">
        <p>Subtotal: $${quote.subtotal}</p>
        <p>IVA: $${quote.tax}</p>
        <div class="total-final">Total: $${quote.total}</div>
      </div>
    </body>
    </html>
  `;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup local session management
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  
  app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-key',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true in production
      maxAge: sessionTtl,
    },
  }));
  
  // Create default admin user on startup
  await createDefaultAdmin();
  
  // Auth middleware
  await setupAuth(app);

  // Local authentication routes
  app.post('/api/auth/login', async (req, res) => {
    try {
      console.log("Login request body:", req.body);
      
      // Accept both usernameOrEmail and username fields
      const loginData = req.body.usernameOrEmail ? 
        { username: req.body.usernameOrEmail, password: req.body.password } :
        req.body;
        
      const { username, password } = loginSchema.parse(loginData);
      
      console.log("Attempting login for:", username);
      
      const { user, success } = await authService.login(username, password);
      
      console.log("Login result:", { success, userId: user?.id, role: user?.role });
      
      if (!success) {
        console.log("Login failed for:", username);
        return res.status(401).json({ message: "Credenciales inválidas" });
      }
      
      // Store user session
      req.session.user = user;
      
      console.log("Login successful, session stored for:", user.email);
      
      res.json({ 
        message: "Login exitoso",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      });
    } catch (error) {
      console.error("Error en login:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Logout POST route for API calls
  app.post('/api/auth/logout', (req: any, res) => {
    if (req.session) {
      req.session.destroy((err: any) => {
        if (err) {
          return res.status(500).json({ message: "Error al cerrar sesión" });
        }
        res.clearCookie('connect.sid');
        res.json({ message: "Sesión cerrada exitosamente" });
      });
    } else {
      res.json({ message: "No hay sesión activa" });
    }
  });

  // Logout GET route for direct navigation
  app.get('/api/logout', (req: any, res) => {
    if (req.session) {
      req.session.destroy((err: any) => {
        if (err) {
          console.error("Error destroying session:", err);
          return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
      });
    } else {
      res.redirect('/');
    }
  });

  app.get('/api/auth/current', (req: any, res) => {
    if (req.session && req.session.user) {
      const user = req.session.user;
      return res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      });
    }
    res.status(401).json({ message: "No autenticado" });
  });

  // Temporary auth bypass for testing
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // First check if user is authenticated locally
      if (req.session && req.session.user) {
        const user = req.session.user;
        return res.json({
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          profileImageUrl: user.profileImageUrl
        });
      }
      
      // Check if user is authenticated via Replit Auth
      if (req.isAuthenticated && req.isAuthenticated() && req.user?.claims?.sub) {
        const userId = req.user.claims.sub;
        const user = await storage.getUser(userId);
        return res.json(user);
      }
      
      // No authenticated user found
      return res.status(401).json({ message: "Not authenticated" });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Customer registration route
  app.post('/api/register/customer', async (req, res) => {
    try {
      console.log("Customer registration request received for email:", req.body.email);
      const customerData = customerRegistrationSchema.parse(req.body);
      console.log("Customer data parsed successfully for:", customerData.email);
      
      // Generate a username from email (before @)
      const username = customerData.email.split('@')[0];
      
      // Check if email already exists in local_users
      const existingUser = await storage.getLocalUserByEmail(customerData.email);
      if (existingUser) {
        return res.status(400).json({ message: "El email ya está registrado" });
      }
      
      // Handle company creation/selection
      let companyId = customerData.companyId || null;
      
      if (customerData.newCompany && customerData.newCompany.name) {
        // Create new company
        const newCompany = await storage.createCompany({
          name: customerData.newCompany.name,
          taxId: customerData.newCompany.taxId || null,
          industry: customerData.newCompany.industry || null,
          contactEmail: customerData.newCompany.contactEmail || null,
          contactPhone: customerData.newCompany.contactPhone || null,
          website: customerData.newCompany.website || null,
          address: customerData.address,
          city: customerData.city,
          state: customerData.state,
          zipCode: customerData.zipCode,
          isActive: true
        });
        companyId = newCompany.id;
      }
      
      // Check if username exists
      const existingUsername = await storage.getLocalUserByUsername(username);
      if (existingUsername) {
        // Add a number to make username unique
        const timestamp = Date.now().toString().slice(-4);
        const uniqueUsername = `${username}${timestamp}`;
        
        // Create customer user in local_users table
        const customerUser = {
          username: uniqueUsername,
          email: customerData.email,
          password: customerData.password,
          firstName: customerData.firstName,
          lastName: customerData.lastName,
          role: 'customer' as const,
          phone: customerData.phone,
          companyId: companyId,
          address: customerData.address,
          city: customerData.city,
          state: customerData.state,
          zipCode: customerData.zipCode,
          isActive: true,
          profileImageUrl: null
        };

        const user = await authService.createUser(customerUser);
        console.log("Customer user created successfully:", { id: user.id, username: user.username, email: user.email });
        
        // Automatically log in the user after successful registration
        req.session.userId = user.id;
        req.session.userRole = user.role;
        console.log("User session established after registration:", { userId: user.id, role: user.role });
        
        res.json({ 
          message: 'Cliente registrado exitosamente',
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            companyId: user.companyId
          }
        });
      } else {
        // Create customer user in local_users table
        const customerUser = {
          username: username,
          email: customerData.email,
          password: customerData.password,
          firstName: customerData.firstName,
          lastName: customerData.lastName,
          role: 'customer' as const,
          phone: customerData.phone,
          companyId: companyId,
          address: customerData.address,
          city: customerData.city,
          state: customerData.state,
          zipCode: customerData.zipCode,
          isActive: true,
          profileImageUrl: null
        };

        const user = await authService.createUser(customerUser);
        console.log("Customer user created successfully:", { id: user.id, username: user.username, email: user.email });
        
        // Automatically log in the user after successful registration
        req.session.userId = user.id;
        req.session.userRole = user.role;
        console.log("User session established after registration:", { userId: user.id, role: user.role });
        
        res.json({ 
          message: 'Cliente registrado exitosamente',
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            companyId: user.companyId
          }
        });
      }
    } catch (error) {
      console.error("Error registering customer:", error);
      console.error("Error details:", error.message, error.stack);
      if (error.code === '23505') { // Unique constraint violation
        return res.status(400).json({ message: "El email ya está registrado" });
      }
      if (error instanceof z.ZodError) {
        console.error("Validation errors:", error.errors);
        return res.status(400).json({ message: "Datos de registro inválidos", errors: error.errors });
      }
      res.status(400).json({ message: "Error al registrar el cliente" });
    }
  });

  // Admin registration route
  app.post('/api/auth/register-admin', async (req, res) => {
    try {
      const adminData = adminRegistrationSchema.parse(req.body);
      
      // Verify admin code
      if (adminData.adminCode !== "TREE2024ADMIN") {
        return res.status(400).json({ message: "Código de administrador inválido" });
      }

      // Check if email already exists in local_users
      const existingLocalUser = await storage.getLocalUserByEmail(adminData.email);
      if (existingLocalUser) {
        return res.status(400).json({ message: "El email ya está registrado" });
      }

      // Create a username from email (before @)
      const username = adminData.email.split('@')[0];
      
      // Check if username exists
      const existingUsername = await storage.getLocalUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ message: "El nombre de usuario ya está en uso" });
      }

      // Create admin user in local_users table for login
      const adminUser: InsertLocalUser = {
        username: username,
        password: adminData.password, // Will be hashed by authService
        email: adminData.email,
        firstName: adminData.firstName,
        lastName: adminData.lastName || '',
        role: 'admin',
        isActive: true,
      };

      const user = await authService.createUser(adminUser);
      res.json({ 
        message: "Administrador registrado exitosamente", 
        user: { 
          id: user.id, 
          username: user.username,
          email: user.email, 
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role 
        } 
      });
    } catch (error) {
      console.error("Admin registration error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Datos de registro inválidos", errors: error.errors });
      }
      if (error.code === '23505') { // Unique constraint violation
        return res.status(400).json({ message: "El email ya está registrado" });
      }
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Quote request route
  app.post('/api/quotes/request', async (req, res) => {
    try {
      const quoteData = quoteRequestSchema.parse(req.body);
      const { customerId, customerInfo } = req.body;
      
      // Handle customer ID for both authenticated and non-authenticated users
      let finalCustomerId = customerId;
      
      if (customerId) {
        // For authenticated users, ensure they exist in the users table
        const existingUser = await storage.getUserById(customerId.toString());
        if (!existingUser) {
          // Create user entry if it doesn't exist
          const localUser = await storage.getLocalUser(parseInt(customerId));
          if (localUser) {
            const userForQuotes = {
              id: customerId.toString(),
              email: localUser.email,
              firstName: localUser.firstName,
              lastName: localUser.lastName,
              role: localUser.role,
              phone: localUser.phone,
              company: localUser.company,
              address: localUser.address,
              city: localUser.city,
              state: localUser.state,
              zipCode: localUser.zipCode,
              isActive: localUser.isActive,
              profileImageUrl: null
            };
            await storage.upsertUser(userForQuotes);
          }
        }
        finalCustomerId = customerId.toString();
      } else if (customerInfo) {
        // For non-authenticated users, create a temporary customer
        const tempCustomerId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const tempCustomer = {
          id: tempCustomerId,
          email: customerInfo.email,
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          role: 'customer' as const,
          phone: customerInfo.phone,
          company: customerInfo.company || null,
          address: customerInfo.address || '',
          city: customerInfo.city || '',
          state: customerInfo.state || '',
          zipCode: customerInfo.zipCode || '',
          isActive: true,
          profileImageUrl: null
        };
        await storage.upsertUser(tempCustomer);
        finalCustomerId = tempCustomerId;
      }

      // Calculate total estimated amount
      let totalAmount = 0;
      const items = [];
      
      for (const item of quoteData.products) {
        const product = await storage.getProduct(item.productId);
        if (product) {
          const itemTotal = parseFloat(product.price) * item.quantity;
          totalAmount += itemTotal;
          items.push({
            productName: product.name,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            unitPrice: parseFloat(product.price),
            total: itemTotal,
            notes: item.notes
          });
        }
      }

      // Generate quote number
      const quoteNumber = `QT-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
      
      // Create quote
      const quote = {
        quoteNumber,
        customerId: finalCustomerId,
        items: JSON.stringify(items),
        subtotal: totalAmount.toString(),
        total: totalAmount.toString(),
        urgency: quoteData.urgency,
        notes: quoteData.notes || '',
        preferredDeliveryDate: quoteData.preferredDeliveryDate ? new Date(quoteData.preferredDeliveryDate) : null,
        status: 'pending' as const
      };

      const newQuote = await storage.createQuote(quote);
      res.json({ 
        message: 'Solicitud de presupuesto enviada exitosamente',
        quote: newQuote
      });
    } catch (error) {
      console.error("Error creating quote request:", error);
      res.status(400).json({ message: "Error al crear la solicitud de presupuesto" });
    }
  });

  // Admin middleware - simplified for testing
  const isAdmin = (req: any, res: any, next: any) => {
    // For testing, allow all admin operations
    // In production, this would check actual user authentication and role
    next();
  };

  // Categories
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post('/api/categories', isAdmin, async (req, res) => {
    try {
      const data = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(data);
      res.json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(400).json({ message: "Failed to create category" });
    }
  });

  // Brands
  app.get('/api/brands', async (req, res) => {
    try {
      const brands = await storage.getBrands();
      res.json(brands);
    } catch (error) {
      console.error("Error fetching brands:", error);
      res.status(500).json({ message: "Failed to fetch brands" });
    }
  });

  app.post('/api/brands', isAdmin, async (req, res) => {
    try {
      const data = insertBrandSchema.parse(req.body);
      const brand = await storage.createBrand(data);
      res.json(brand);
    } catch (error) {
      console.error("Error creating brand:", error);
      res.status(400).json({ message: "Failed to create brand" });
    }
  });

  app.put('/api/brands/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertBrandSchema.partial().parse(req.body);
      const brand = await storage.updateBrand(id, data);
      res.json(brand);
    } catch (error) {
      console.error("Error updating brand:", error);
      res.status(400).json({ message: "Failed to update brand" });
    }
  });

  app.delete('/api/brands/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteBrand(id);
      res.json({ message: "Brand deleted successfully" });
    } catch (error) {
      console.error("Error deleting brand:", error);
      res.status(500).json({ message: "Failed to delete brand" });
    }
  });

  // Companies endpoints
  app.get('/api/companies', async (req, res) => {
    try {
      const activeOnly = req.query.activeOnly === 'true';
      const companies = await storage.getCompanies(activeOnly);
      res.json(companies);
    } catch (error) {
      console.error("Error fetching companies:", error);
      res.status(500).json({ message: "Failed to fetch companies" });
    }
  });

  app.get('/api/companies/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const company = await storage.getCompany(id);
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      res.json(company);
    } catch (error) {
      console.error("Error fetching company:", error);
      res.status(500).json({ message: "Failed to fetch company" });
    }
  });

  app.post('/api/companies', isAdmin, async (req, res) => {
    try {
      // Transform empty strings to null for numeric fields
      const processedData = {
        ...req.body,
        companyTypeId: req.body.companyTypeId === "" ? null : req.body.companyTypeId,
        employeeCount: req.body.employeeCount === "" ? null : req.body.employeeCount,
        foundedYear: req.body.foundedYear === "" ? null : req.body.foundedYear,
        creditLimit: req.body.creditLimit === "" ? null : req.body.creditLimit,
      };
      
      const validatedData = insertCompanySchema.parse(processedData);
      const company = await storage.createCompany(validatedData);
      res.status(201).json(company);
    } catch (error) {
      console.error("Error creating company:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create company" });
    }
  });

  app.put('/api/companies/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Transform empty strings to null for numeric fields
      const processedData = {
        ...req.body,
        companyTypeId: req.body.companyTypeId === "" ? null : req.body.companyTypeId,
        employeeCount: req.body.employeeCount === "" ? null : req.body.employeeCount,
        foundedYear: req.body.foundedYear === "" ? null : req.body.foundedYear,
        creditLimit: req.body.creditLimit === "" ? null : req.body.creditLimit,
      };
      
      const validatedData = insertCompanySchema.parse(processedData);
      const company = await storage.updateCompany(id, validatedData);
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      res.json(company);
    } catch (error) {
      console.error("Error updating company:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to update company" });
    }
  });

  app.delete('/api/companies/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCompany(id);
      if (!success) {
        return res.status(404).json({ message: "Company not found" });
      }
      res.json({ message: "Company deleted successfully" });
    } catch (error) {
      console.error("Error deleting company:", error);
      res.status(500).json({ message: "Failed to delete company" });
    }
  });

  // Company Types endpoints
  app.get('/api/company-types', async (req, res) => {
    try {
      const activeOnly = req.query.activeOnly === 'true';
      const companyTypes = await storage.getCompanyTypes(activeOnly);
      res.json(companyTypes);
    } catch (error) {
      console.error("Error fetching company types:", error);
      res.status(500).json({ message: "Failed to fetch company types" });
    }
  });

  app.get('/api/company-types/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const companyType = await storage.getCompanyType(id);
      if (!companyType) {
        return res.status(404).json({ message: "Company type not found" });
      }
      res.json(companyType);
    } catch (error) {
      console.error("Error fetching company type:", error);
      res.status(500).json({ message: "Failed to fetch company type" });
    }
  });

  app.post('/api/company-types', isAdmin, async (req, res) => {
    try {
      const validatedData = insertCompanyTypeSchema.parse(req.body);
      const companyType = await storage.createCompanyType(validatedData);
      res.status(201).json(companyType);
    } catch (error) {
      console.error("Error creating company type:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create company type" });
    }
  });

  app.put('/api/company-types/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCompanyTypeSchema.parse(req.body);
      const companyType = await storage.updateCompanyType(id, validatedData);
      if (!companyType) {
        return res.status(404).json({ message: "Company type not found" });
      }
      res.json(companyType);
    } catch (error) {
      console.error("Error updating company type:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to update company type" });
    }
  });

  app.delete('/api/company-types/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCompanyType(id);
      res.json({ message: "Company type deleted successfully" });
    } catch (error) {
      console.error("Error deleting company type:", error);
      res.status(500).json({ message: "Failed to delete company type" });
    }
  });

  // Product pricing endpoints
  app.get('/api/products/:id/pricing', async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const pricing = await storage.getProductPricing(productId);
      res.json(pricing);
    } catch (error) {
      console.error("Error fetching product pricing:", error);
      res.status(500).json({ message: "Failed to fetch product pricing" });
    }
  });

  app.post('/api/products/:id/pricing', isAdmin, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      
      // Validate the pricing array
      const pricingSchema = z.array(insertProductPricingSchema.omit({ productId: true }));
      const validatedPricing = pricingSchema.parse(req.body);
      
      const pricing = await storage.setProductPricing(productId, validatedPricing);
      res.json(pricing);
    } catch (error) {
      console.error("Error setting product pricing:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to set product pricing" });
    }
  });

  app.get('/api/products/:productId/pricing/:companyTypeId', async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      const companyTypeId = parseInt(req.params.companyTypeId);
      const price = await storage.getProductPriceForCompanyType(productId, companyTypeId);
      res.json({ price });
    } catch (error) {
      console.error("Error fetching product price for company type:", error);
      res.status(500).json({ message: "Failed to fetch product price" });
    }
  });

  // Sizes
  app.get('/api/sizes', async (req, res) => {
    try {
      const sizes = await storage.getSizes();
      res.json(sizes);
    } catch (error) {
      console.error("Error fetching sizes:", error);
      res.status(500).json({ message: "Failed to fetch sizes" });
    }
  });

  app.post('/api/sizes', isAdmin, async (req, res) => {
    try {
      const data = insertSizeSchema.parse(req.body);
      const size = await storage.createSize(data);
      res.json(size);
    } catch (error) {
      console.error("Error creating size:", error);
      res.status(400).json({ message: "Failed to create size" });
    }
  });

  // Colors
  app.get('/api/colors', async (req, res) => {
    try {
      const colors = await storage.getColors();
      res.json(colors);
    } catch (error) {
      console.error("Error fetching colors:", error);
      res.status(500).json({ message: "Failed to fetch colors" });
    }
  });

  app.post('/api/colors', isAdmin, async (req, res) => {
    try {
      const data = insertColorSchema.parse(req.body);
      const color = await storage.createColor(data);
      res.json(color);
    } catch (error) {
      console.error("Error creating color:", error);
      res.status(400).json({ message: "Failed to create color" });
    }
  });

  // Garment Types
  app.get('/api/garment-types', async (req, res) => {
    try {
      const garmentTypes = await storage.getGarmentTypes();
      res.json(garmentTypes);
    } catch (error) {
      console.error("Error fetching garment types:", error);
      res.status(500).json({ message: "Failed to fetch garment types" });
    }
  });

  app.post('/api/garment-types', isAdmin, async (req, res) => {
    try {
      const data = insertGarmentTypeSchema.parse(req.body);
      const garmentType = await storage.createGarmentType(data);
      res.json(garmentType);
    } catch (error) {
      console.error("Error creating garment type:", error);
      res.status(400).json({ message: "Failed to create garment type" });
    }
  });

  // Size ranges routes
  app.get("/api/size-ranges", async (req, res) => {
    try {
      const { garmentTypeId, gender } = req.query;
      let conditions = [eq(sizeRanges.isActive, true)];
      
      if (garmentTypeId) {
        conditions.push(eq(sizeRanges.garmentTypeId, parseInt(garmentTypeId as string)));
      }
      
      if (gender) {
        conditions.push(eq(sizeRanges.gender, gender as string));
      }
      
      const ranges = await db.select().from(sizeRanges).where(and(...conditions));
      res.json(ranges);
    } catch (error: any) {
      console.error("Error fetching size ranges:", error);
      res.status(500).json({ message: "Failed to fetch size ranges" });
    }
  });

  // Get available sizes for specific garment type and gender
  app.get("/api/size-ranges/available-sizes", async (req, res) => {
    try {
      const { garmentTypeId, gender } = req.query;
      
      if (!garmentTypeId || !gender) {
        return res.status(400).json({ message: "garmentTypeId and gender are required" });
      }

      // Get size range for the specific garment type and gender
      const [sizeRange] = await db
        .select()
        .from(sizeRanges)
        .where(
          and(
            eq(sizeRanges.garmentTypeId, parseInt(garmentTypeId as string)),
            eq(sizeRanges.gender, gender as string),
            eq(sizeRanges.isActive, true)
          )
        );

      if (!sizeRange) {
        // Return empty result with appropriate message
        return res.json({ sizes: [], sizeType: "standard" });
      }

      let sizes: string[] = [];
      
      // Generate sizes based on the range configuration
      if (sizeRange.sizeList && sizeRange.sizeList.length > 0) {
        sizes = sizeRange.sizeList;
      } else if (sizeRange.minSize && sizeRange.maxSize) {
        // Generate numeric range
        const min = parseInt(sizeRange.minSize as string);
        const max = parseInt(sizeRange.maxSize as string);
        for (let i = min; i <= max; i++) {
          sizes.push(i.toString());
        }
      } else {
        // Use default sizes based on type
        switch (sizeRange.sizeType) {
          case 'standard':
            sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'];
            break;
          case 'waist':
            sizes = ['28', '30', '32', '34', '36', '38', '40', '42', '44'];
            break;
          case 'clothing':
            sizes = ['5', '7', '9', '11', '13', '15', '17', '19', '21'];
            break;
          default:
            sizes = ['S', 'M', 'L', 'XL'];
        }
      }

      res.json({
        sizes,
        sizeType: sizeRange.sizeType
      });
    } catch (error: any) {
      console.error("Error fetching available sizes:", error);
      res.status(500).json({ message: "Failed to fetch available sizes" });
    }
  });



  // Products
  app.get('/api/products', async (req, res) => {
    try {
      const { categoryId, brandId, gender, garmentTypeId, isActive, search, limit, offset } = req.query;
      const filters = {
        categoryId: categoryId ? parseInt(categoryId as string) : undefined,
        brandId: brandId ? parseInt(brandId as string) : undefined,
        gender: gender as string,
        garmentTypeId: garmentTypeId ? parseInt(garmentTypeId as string) : undefined,
        isActive: isActive !== undefined ? isActive === 'true' : undefined,
        search: search as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      };
      
      const products = await storage.getProducts(filters);
      
      // Check if user is logged in and get their company info for pricing
      let userCompanyType = null;
      console.log("=== PRICING DEBUG ===");
      console.log("Session user:", req.session?.user);
      
      if (req.session && req.session.user && req.session.user.role === 'customer') {
        try {
          console.log("Getting customer with ID:", req.session.user.id);
          const customer = await storage.getLocalUserById(req.session.user.id);
          console.log("Customer found:", { id: customer?.id, email: customer?.email, companyId: customer?.companyId });
          
          if (customer && customer.companyId) {
            console.log("Getting company with ID:", customer.companyId);
            const company = await storage.getCompany(customer.companyId);
            console.log("Company found:", { id: company?.id, name: company?.name, companyTypeId: company?.companyTypeId });
            
            if (company && company.companyTypeId) {
              console.log("Getting company type with ID:", company.companyTypeId);
              userCompanyType = await storage.getCompanyType(company.companyTypeId);
              console.log("Company type found:", { id: userCompanyType?.id, name: userCompanyType?.name, discountPercentage: userCompanyType?.discountPercentage });
            }
          }
        } catch (error) {
          console.log("Could not fetch user company type:", error);
        }
      }
      console.log("Final userCompanyType:", userCompanyType);
      console.log("=== END PRICING DEBUG ===");
      
      // Add pricing information to products
      const productsWithPricing = await Promise.all(products.map(async (product) => {
        let discountedPrice = product.price;
        let discount = 0;
        
        if (userCompanyType && userCompanyType.discountPercentage) {
          discount = parseFloat(userCompanyType.discountPercentage);
          discountedPrice = product.price * (1 - discount / 100);
        }
        
        return {
          ...product,
          originalPrice: product.price,
          discountedPrice: discountedPrice,
          discount: discount,
          companyTypeName: userCompanyType?.name || null
        };
      }));
      
      res.json(productsWithPricing);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Products management - with brand and category details (admin only)
  app.get('/api/products/management', isLocallyAuthenticated, isLocalAdmin, async (req, res) => {
    try {
      const products = await storage.getProductsWithDetails();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products for management:", error);
      res.status(500).json({ message: "Failed to fetch products for management" });
    }
  });

  // Update product price endpoint (admin only)
  app.patch('/api/products/:id/price', isLocallyAuthenticated, isLocalAdmin, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const { price } = req.body;
      
      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
        return res.status(400).json({ message: "Invalid price" });
      }

      const updatedProduct = await storage.updateProductPrice(productId, parseFloat(price));
      res.json(updatedProduct);
    } catch (error) {
      console.error("Error updating product price:", error);
      res.status(500).json({ message: "Failed to update product price" });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Check if user is logged in and get their company info for pricing
      let userCompanyType = null;
      if (req.session && req.session.user && req.session.user.role === 'customer') {
        try {
          const customer = await storage.getLocalUserById(req.session.user.id);
          if (customer && customer.companyId) {
            const company = await storage.getCompany(customer.companyId);
            if (company && company.companyTypeId) {
              userCompanyType = await storage.getCompanyType(company.companyTypeId);
            }
          }
        } catch (error) {
          console.log("Could not fetch user company type:", error);
        }
      }
      
      // Add pricing information to product
      let discountedPrice = product.price;
      let discount = 0;
      
      if (userCompanyType && userCompanyType.discountPercentage) {
        discount = parseFloat(userCompanyType.discountPercentage);
        discountedPrice = product.price * (1 - discount / 100);
      }
      
      const productWithPricing = {
        ...product,
        originalPrice: product.price,
        discountedPrice: discountedPrice,
        discount: discount,
        companyTypeName: userCompanyType?.name || null
      };
      
      res.json(productWithPricing);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post('/api/products', isAdmin, async (req, res) => {
    try {
      const data = insertProductSchema.parse(req.body);
      
      // Generate SKU if not provided
      if (!data.sku || data.sku.trim() === '') {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 5);
        data.sku = `PRD-${timestamp}-${random}`.toUpperCase();
      }
      
      const product = await storage.createProduct(data);
      res.json(product);
    } catch (error: any) {
      console.error("Error creating product:", error);
      
      // Handle specific database constraint errors
      if (error?.code === '23505' && error?.constraint === 'products_sku_unique') {
        return res.status(400).json({ 
          message: "El SKU ya existe en el sistema",
          error: "duplicate_sku",
          detail: `El SKU "${error?.detail?.match(/Key \(sku\)=\(([^)]+)\)/)?.[1] || 'desconocido'}" ya está siendo usado por otro producto.`
        });
      }
      
      res.status(400).json({ message: "Error al crear el producto" });
    }
  });

  app.put('/api/products/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, data);
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(400).json({ message: "Failed to update product" });
    }
  });

  app.delete('/api/products/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProduct(id);
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Inventory
  app.get('/api/products/:id/inventory', async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const inventory = await storage.getInventory(productId);
      res.json(inventory);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      res.status(500).json({ message: "Failed to fetch inventory" });
    }
  });

  app.put('/api/products/:id/inventory', isAdmin, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const { size, color, quantity } = req.body;
      const inventory = await storage.updateInventory(productId, size, color, quantity);
      res.json(inventory);
    } catch (error) {
      console.error("Error updating inventory:", error);
      res.status(400).json({ message: "Failed to update inventory" });
    }
  });

  // Product Color Images
  app.get('/api/products/:id/color-images', async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      const colorImages = await storage.getProductColorImages(productId);
      res.json(colorImages);
    } catch (error) {
      console.error("Error fetching product color images:", error);
      res.status(500).json({ message: "Failed to fetch product color images" });
    }
  });

  app.post('/api/products/:id/color-images', isAdmin, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const data = insertProductColorImageSchema.parse({
        ...req.body,
        productId
      });
      
      const colorImage = await storage.createProductColorImage(data);
      res.json(colorImage);
    } catch (error) {
      console.error("Error creating product color image:", error);
      res.status(400).json({ message: "Failed to create product color image" });
    }
  });

  app.put('/api/products/:productId/color-images/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid color image ID" });
      }
      
      const data = insertProductColorImageSchema.partial().parse(req.body);
      const colorImage = await storage.updateProductColorImage(id, data);
      res.json(colorImage);
    } catch (error) {
      console.error("Error updating product color image:", error);
      res.status(400).json({ message: "Failed to update product color image" });
    }
  });

  app.delete('/api/products/:productId/color-images/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid color image ID" });
      }
      
      await storage.deleteProductColorImage(id);
      res.json({ message: "Product color image deleted successfully" });
    } catch (error) {
      console.error("Error deleting product color image:", error);
      res.status(500).json({ message: "Failed to delete product color image" });
    }
  });

  app.delete('/api/products/:id/color-images/clear', isAdmin, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      await storage.clearProductColorImages(productId);
      res.json({ message: "All color images cleared successfully" });
    } catch (error) {
      console.error("Error clearing product color images:", error);
      res.status(500).json({ message: "Failed to clear product color images" });
    }
  });

  // Orders
  app.get('/api/orders', isLocallyAuthenticated, async (req: any, res) => {
    try {
      const user = req.session.user;
      
      const { status, limit, offset } = req.query;
      const filters = {
        customerId: user?.role === 'admin' ? undefined : user.id.toString(),
        status: status as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      };
      
      const orders = await storage.getOrders(filters);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get('/api/orders/:id', isLocallyAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = req.session.user;
      
      const order = await storage.getOrderWithItems(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Check authorization
      if (user?.role !== 'admin' && order.customerId !== user.id.toString()) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  const createOrderSchema = z.object({
    order: insertOrderSchema,
    items: z.array(insertOrderItemSchema),
  });

  app.post('/api/orders', async (req, res) => {
    try {
      const { order, items } = createOrderSchema.parse(req.body);
      const newOrder = await storage.createOrder(order, items);
      res.json(newOrder);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(400).json({ message: "Failed to create order" });
    }
  });

  app.put('/api/orders/:id/status', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const order = await storage.updateOrderStatus(id, status);
      res.json(order);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(400).json({ message: "Failed to update order status" });
    }
  });

  app.get('/api/orders/:id/pdf', isLocallyAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = req.session.user;
      
      // Get order with items
      const order = await storage.getOrderWithItems(id);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Check permissions: admin can access all orders, customers only their own
      if (user?.role !== 'admin' && order.customerId !== user?.id?.toString()) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Generate HTML content
      const htmlContent = generateOrderPDFHTML(order);
      
      // Set headers for PDF download
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="pedido-${order.orderNumber}.html"`);
      
      // For now, return HTML content (we'll implement actual PDF generation)
      res.send(htmlContent);
    } catch (error) {
      console.error("Error generating order PDF:", error);
      res.status(500).json({ message: "Failed to generate order PDF" });
    }
  });

  // Quotes
  app.get('/api/quotes', isLocallyAuthenticated, async (req: any, res) => {
    try {
      const user = req.session.user;
      
      // If admin, show all quotes; if customer, show only their quotes
      const customerId = user?.role === 'admin' ? undefined : user.id.toString();
      const quotes = await storage.getQuotes(customerId);
      res.json(quotes);
    } catch (error) {
      console.error("Error fetching quotes:", error);
      res.status(500).json({ message: "Failed to fetch quotes" });
    }
  });

  app.post('/api/quotes', isAdmin, async (req, res) => {
    try {
      const data = insertQuoteSchema.parse(req.body);
      const quote = await storage.createQuote(data);
      res.json(quote);
    } catch (error) {
      console.error("Error creating quote:", error);
      res.status(400).json({ message: "Failed to create quote" });
    }
  });

  app.put('/api/quotes/:id', isLocalAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      
      // Validate the update data
      const allowedFields = ['status', 'notes', 'validUntil', 'subtotal', 'tax', 'total'];
      const filteredData = Object.keys(updateData)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = updateData[key];
          return obj;
        }, {} as any);

      const updatedQuote = await storage.updateQuote(id, filteredData);
      res.json(updatedQuote);
    } catch (error) {
      console.error("Error updating quote:", error);
      res.status(400).json({ message: "Failed to update quote" });
    }
  });

  app.get('/api/quotes/:id/pdf', isLocallyAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = req.session.user;
      
      // Get quote with customer information
      const quotes = await storage.getQuotes();
      const quote = quotes.find(q => q.id === id);
      
      if (!quote) {
        return res.status(404).json({ message: "Quote not found" });
      }

      // Check permissions: admin can access all quotes, customers only their own
      if (user?.role !== 'admin' && quote.customerId !== user?.id?.toString()) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Generate PDF HTML content
      const pdfHtml = generateQuotePDFHTML(quote);
      
      // Set response headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="Presupuesto-${quote.quoteNumber}.pdf"`);
      
      // For now, return HTML content (we'll implement actual PDF generation)
      res.setHeader('Content-Type', 'text/html');
      res.send(pdfHtml);
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ message: "Failed to generate PDF" });
    }
  });

  // Customers management
  app.get('/api/customers', isLocalAdmin, async (req, res) => {
    try {
      const customers = await storage.getCustomers();
      res.json(customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  // Update customer company assignment
  app.patch('/api/customers/:customerId/company', isLocalAdmin, async (req, res) => {
    try {
      const { customerId } = req.params;
      const { companyId } = req.body;

      // Validate customer ID
      if (!customerId) {
        return res.status(400).json({ message: "Customer ID is required" });
      }

      // Update customer company assignment
      await storage.updateCustomerCompany(customerId, companyId);
      
      res.json({ message: "Customer company updated successfully" });
    } catch (error) {
      console.error("Error updating customer company:", error);
      res.status(500).json({ message: "Failed to update customer company" });
    }
  });

  // Dashboard analytics
  app.get('/api/dashboard/stats', isLocalAdmin, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  app.get('/api/dashboard/top-products', async (req, res) => {
    try {
      const { limit } = req.query;
      const topProducts = await storage.getTopProducts(
        limit ? parseInt(limit as string) : undefined
      );
      res.json(topProducts);
    } catch (error) {
      console.error("Error fetching top products:", error);
      res.status(500).json({ message: "Failed to fetch top products" });
    }
  });

  app.get('/api/dashboard/recent-orders', isAdmin, async (req, res) => {
    try {
      const { limit } = req.query;
      const recentOrders = await storage.getRecentOrders(
        limit ? parseInt(limit as string) : undefined
      );
      res.json(recentOrders);
    } catch (error) {
      console.error("Error fetching recent orders:", error);
      res.status(500).json({ message: "Failed to fetch recent orders" });
    }
  });

  // Sales Analytics API
  app.get('/api/sales/summary', isAdmin, async (req, res) => {
    try {
      const { dateRange } = req.query;
      const summary = await storage.getSalesSummary(dateRange as string);
      res.json(summary);
    } catch (error) {
      console.error("Error fetching sales summary:", error);
      res.status(500).json({ message: "Failed to fetch sales summary" });
    }
  });

  app.get('/api/sales/analytics', isAdmin, async (req, res) => {
    try {
      const { period, category, brand } = req.query;
      const analytics = await storage.getSalesAnalytics({
        period: period as string,
        category: category as string,
        brand: brand as string
      });
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching sales analytics:", error);
      res.status(500).json({ message: "Failed to fetch sales analytics" });
    }
  });

  app.get('/api/sales/trends', isAdmin, async (req, res) => {
    try {
      const { period, type } = req.query;
      const trends = await storage.getSalesTrends({
        period: period as string,
        type: type as string
      });
      res.json(trends);
    } catch (error) {
      console.error("Error fetching sales trends:", error);
      res.status(500).json({ message: "Failed to fetch sales trends" });
    }
  });

  // Promotions routes
  app.get('/api/promotions', async (req, res) => {
    try {
      const { active } = req.query;
      const promotions = await storage.getPromotions(active === 'true');
      res.json(promotions);
    } catch (error) {
      console.error("Error fetching promotions:", error);
      res.status(500).json({ message: "Failed to fetch promotions" });
    }
  });

  app.get('/api/promotions/active', async (req, res) => {
    try {
      const activePromotions = await storage.getActivePromotions();
      res.json(activePromotions);
    } catch (error) {
      console.error("Error fetching active promotions:", error);
      res.status(500).json({ message: "Failed to fetch active promotions" });
    }
  });

  app.get('/api/promotions/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const promotion = await storage.getPromotion(id);
      if (!promotion) {
        return res.status(404).json({ message: "Promotion not found" });
      }
      res.json(promotion);
    } catch (error) {
      console.error("Error fetching promotion:", error);
      res.status(500).json({ message: "Failed to fetch promotion" });
    }
  });

  app.post('/api/promotions', isAdmin, async (req, res) => {
    try {
      const data = insertPromotionSchema.parse(req.body);
      const promotion = await storage.createPromotion(data);
      res.json(promotion);
    } catch (error) {
      console.error("Error creating promotion:", error);
      res.status(400).json({ message: "Failed to create promotion" });
    }
  });

  app.put('/api/promotions/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertPromotionSchema.partial().parse(req.body);
      const promotion = await storage.updatePromotion(id, data);
      res.json(promotion);
    } catch (error) {
      console.error("Error updating promotion:", error);
      res.status(400).json({ message: "Failed to update promotion" });
    }
  });

  app.delete('/api/promotions/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePromotion(id);
      res.json({ message: "Promotion deleted successfully" });
    } catch (error) {
      console.error("Error deleting promotion:", error);
      res.status(500).json({ message: "Failed to delete promotion" });
    }
  });

  // Industry sections routes
  app.get('/api/industry-sections', async (req, res) => {
    try {
      const { active } = req.query;
      const sections = await storage.getIndustrySections(active === 'true');
      res.json(sections);
    } catch (error) {
      console.error("Error fetching industry sections:", error);
      res.status(500).json({ message: "Failed to fetch industry sections" });
    }
  });

  app.get('/api/industry-sections/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const section = await storage.getIndustrySection(id);
      if (!section) {
        return res.status(404).json({ message: "Industry section not found" });
      }
      res.json(section);
    } catch (error) {
      console.error("Error fetching industry section:", error);
      res.status(500).json({ message: "Failed to fetch industry section" });
    }
  });

  app.post('/api/industry-sections', isAdmin, async (req, res) => {
    try {
      const data = insertIndustrySectionSchema.parse(req.body);
      const section = await storage.createIndustrySection(data);
      res.json(section);
    } catch (error) {
      console.error("Error creating industry section:", error);
      res.status(400).json({ message: "Failed to create industry section" });
    }
  });

  app.put('/api/industry-sections/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertIndustrySectionSchema.partial().parse(req.body);
      const section = await storage.updateIndustrySection(id, data);
      res.json(section);
    } catch (error) {
      console.error("Error updating industry section:", error);
      res.status(400).json({ message: "Failed to update industry section" });
    }
  });

  app.delete('/api/industry-sections/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteIndustrySection(id);
      res.json({ message: "Industry section deleted successfully" });
    } catch (error) {
      console.error("Error deleting industry section:", error);
      res.status(500).json({ message: "Failed to delete industry section" });
    }
  });

  // Object storage routes
  const { ObjectStorageService } = await import("./objectStorage");
  
  app.post('/api/objects/upload', isAdmin, async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  // Route to update industry section image
  app.put('/api/industry-sections/:id/image', isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { imageUrl } = req.body;

      if (!imageUrl) {
        return res.status(400).json({ error: "imageUrl is required" });
      }

      const objectStorageService = new ObjectStorageService();
      const objectPath = objectStorageService.normalizeObjectEntityPath(imageUrl);

      // Update the industry section with the new image URL using storage interface
      await storage.updateIndustrySection(parseInt(id), { imageUrl: objectPath });

      res.json({ success: true, objectPath });
    } catch (error) {
      console.error("Error updating industry section image:", error);
      res.status(500).json({ error: "Failed to update image" });
    }
  });

  // Contact Messages endpoints
  // POST /api/contact-messages - Create a new contact message
  app.post('/api/contact-messages', async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      res.json(message);
    } catch (error) {
      console.error("Error creating contact message:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create contact message" });
    }
  });

  // GET /api/contact-messages - Get all contact messages (admin only)
  app.get('/api/contact-messages', isLocallyAuthenticated, async (req, res) => {
    try {
      // Check if user is admin
      const user = req.session?.user;
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: "Admin access required" });
      }

      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error getting contact messages:", error);
      res.status(500).json({ error: "Failed to get contact messages" });
    }
  });

  // PATCH /api/contact-messages/:id/read - Mark message as read (admin only)
  app.patch('/api/contact-messages/:id/read', isLocallyAuthenticated, async (req, res) => {
    try {
      // Check if user is admin
      const user = req.session?.user;
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: "Admin access required" });
      }

      const { id } = req.params;
      const message = await storage.markContactMessageAsRead(parseInt(id));
      res.json(message);
    } catch (error) {
      console.error("Error marking message as read:", error);
      res.status(500).json({ error: "Failed to mark message as read" });
    }
  });

  // GET /api/contact-messages/unread-count - Get count of unread messages (admin only)
  app.get('/api/contact-messages/unread-count', isLocallyAuthenticated, async (req, res) => {
    try {
      // Check if user is admin
      const user = req.session?.user;
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: "Admin access required" });
      }

      const count = await storage.getUnreadContactMessagesCount();
      res.json({ count });
    } catch (error) {
      console.error("Error getting unread count:", error);
      res.status(500).json({ error: "Failed to get unread count" });
    }
  });

  // Customer-specific routes
  app.get('/api/customer/orders', isLocallyAuthenticated, async (req: any, res) => {
    try {
      const user = req.session?.user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Filter orders by customer ID only for non-admin users
      const filters = {
        customerId: user.id.toString(),
        limit: 10, // Recent orders
        offset: 0
      };
      
      const orders = await storage.getOrders(filters);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching customer orders:", error);
      res.status(500).json({ message: "Failed to fetch customer orders" });
    }
  });

  app.get('/api/customer/stats', isLocallyAuthenticated, async (req: any, res) => {
    try {
      const user = req.session?.user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Get customer's orders to calculate stats
      const orders = await storage.getOrders({ customerId: user.id.toString() });
      
      const totalOrders = orders.length;
      const totalSpent = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
      
      const stats = {
        totalOrders,
        totalSpent: totalSpent.toFixed(2),
        favoritesCount: 0, // Not implemented yet
        customerLevel: totalOrders > 5 ? 'Premium' : totalOrders > 1 ? 'Regular' : 'Nuevo'
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching customer stats:", error);
      res.status(500).json({ message: "Failed to fetch customer stats" });
    }
  });

  app.get('/api/customer/favorites', isLocallyAuthenticated, async (req: any, res) => {
    try {
      // For now, return empty array - favorites functionality not implemented yet
      res.json([]);
    } catch (error) {
      console.error("Error fetching customer favorites:", error);
      res.status(500).json({ message: "Failed to fetch customer favorites" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

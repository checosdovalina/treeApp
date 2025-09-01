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
  customerRegistrationSchema,
  quoteRequestSchema,
  sizeRanges,
  loginSchema,
  adminRegistrationSchema
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
      const { username, password } = loginSchema.parse(req.body);
      
      const { user, success } = await authService.login(username, password);
      
      if (!success) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }
      
      // Store user session
      req.session.user = user;
      
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
      const customerData = customerRegistrationSchema.parse(req.body);
      
      // Generate a unique customer ID
      const customerId = `customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create customer user
      const customerUser = {
        id: customerId,
        email: customerData.email,
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        role: 'customer' as const,
        phone: customerData.phone,
        company: customerData.company || null,
        address: customerData.address,
        city: customerData.city,
        state: customerData.state,
        zipCode: customerData.zipCode,
        isActive: true,
        profileImageUrl: null
      };

      const user = await storage.upsertUser(customerUser);
      res.json({ 
        message: 'Cliente registrado exitosamente',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          company: user.company
        }
      });
    } catch (error) {
      console.error("Error registering customer:", error);
      if (error.code === '23505') { // Unique constraint violation
        return res.status(400).json({ message: "El email ya está registrado" });
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

      // Check if email already exists
      const existingUser = await storage.getUserByEmail(adminData.email);
      if (existingUser) {
        return res.status(400).json({ message: "El email ya está registrado" });
      }

      // Generate a unique admin ID
      const adminId = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Create admin user
      const adminUser = {
        id: adminId,
        email: adminData.email,
        firstName: adminData.firstName,
        lastName: adminData.lastName,
        role: 'admin' as const,
        phone: null,
        company: null,
        address: '',
        city: '',
        state: '',
        zipCode: '',
        isActive: true,
        profileImageUrl: null
      };

      const user = await storage.upsertUser(adminUser);
      res.json({ 
        message: "Administrador registrado exitosamente", 
        user: { 
          id: user.id, 
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
      
      // If customer is not logged in, create a temporary customer
      let finalCustomerId = customerId;
      if (!customerId && customerInfo) {
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

      // Create quote
      const quote = {
        customerId: finalCustomerId,
        items: JSON.stringify(items),
        totalAmount: totalAmount.toString(),
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
        const min = parseInt(sizeRange.minSize);
        const max = parseInt(sizeRange.maxSize);
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
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
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
      res.json(product);
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
  app.get('/api/orders', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      const { status, limit, offset } = req.query;
      const filters = {
        customerId: user?.role === 'admin' ? undefined : userId,
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

  app.get('/api/orders/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      const order = await storage.getOrderWithItems(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Check authorization
      if (user?.role !== 'admin' && order.customerId !== userId) {
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

  // Quotes
  app.get('/api/quotes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      const customerId = user?.role === 'admin' ? undefined : userId;
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

  // Dashboard analytics
  app.get('/api/dashboard/stats', isAdmin, async (req, res) => {
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

  const httpServer = createServer(app);
  return httpServer;
}

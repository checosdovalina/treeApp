import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
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
  customerRegistrationSchema,
  quoteRequestSchema,
  sizeRanges
} from "@shared/schema";
import { z } from "zod";
import { db } from "./db";
import { eq, and } from "drizzle-orm";



export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Temporary auth bypass for testing
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // Check if user is authenticated via Replit Auth
      if (req.isAuthenticated && req.isAuthenticated() && req.user?.claims?.sub) {
        const userId = req.user.claims.sub;
        const user = await storage.getUser(userId);
        return res.json(user);
      }
      
      // Fallback: return admin user for testing
      const adminUser = await storage.getUser('admin-test');
      if (adminUser) {
        return res.json(adminUser);
      }
      
      // Create and return default admin user
      const defaultAdmin = {
        id: 'admin-test',
        email: 'admin@uniformeslaguna.com',
        firstName: 'Admin',
        lastName: 'Test', 
        role: 'admin',
        profileImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
      };
      
      await storage.upsertUser(defaultAdmin);
      res.json(defaultAdmin);
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
            sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
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

  const httpServer = createServer(app);
  return httpServer;
}

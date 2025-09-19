import {
  users,
  localUsers,
  products,
  categories,
  brands,
  sizes,
  colors,
  garmentTypes,
  inventory,
  orders,
  orderItems,
  quotes,
  productColorImages,
  promotions,
  industrySections,
  companies,
  companyTypes,
  productPricing,
  contactMessages,
  type User,
  type UpsertUser,
  type LocalUser,
  type InsertLocalUser,
  type Product,
  type InsertProduct,
  type Category,
  type InsertCategory,
  type Brand,
  type InsertBrand,
  type Size,
  type InsertSize,
  type Color,
  type InsertColor,
  type GarmentType,
  type InsertGarmentType,
  type Inventory,
  type InsertInventory,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type Quote,
  type InsertQuote,
  type ProductColorImage,
  type InsertProductColorImage,
  type Promotion,
  type InsertPromotion,
  type IndustrySection,
  type InsertIndustrySection,
  type Company,
  type InsertCompany,
  type CompanyType,
  type InsertCompanyType,
  type ProductPricing,
  type InsertProductPricing,
  type ContactMessage,
  type InsertContactMessage,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, ilike, count, arrayContains, lte, gte } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Local authentication operations
  getLocalUserByUsername(username: string): Promise<LocalUser | undefined>;
  getLocalUserByEmail(email: string): Promise<LocalUser | undefined>;
  getLocalUserById(id: number): Promise<LocalUser | undefined>;
  createLocalUser(user: InsertLocalUser): Promise<LocalUser>;
  updateLocalUserLastLogin(id: number): Promise<void>;
  updateCustomerCompany(customerId: string | number, companyId: number | null): Promise<void>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Brand operations
  getBrands(): Promise<Brand[]>;
  createBrand(brand: InsertBrand): Promise<Brand>;
  updateBrand(id: number, updates: Partial<InsertBrand>): Promise<Brand>;
  deleteBrand(id: number): Promise<void>;
  
  // Size operations
  getSizes(): Promise<Size[]>;
  createSize(size: InsertSize): Promise<Size>;
  
  // Color operations
  getColors(): Promise<Color[]>;
  createColor(color: InsertColor): Promise<Color>;
  
  // Garment type operations  
  getGarmentTypes(): Promise<GarmentType[]>;
  createGarmentType(garmentType: InsertGarmentType): Promise<GarmentType>;
  
  // Product operations
  getProducts(filters?: {
    categoryId?: number;
    brandId?: number;
    gender?: string;
    isActive?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
  
  // Inventory operations
  getInventory(productId: number): Promise<Inventory[]>;
  updateInventory(productId: number, size: string, color: string, quantity: number): Promise<Inventory>;
  
  // Product color images operations
  getProductColorImages(productId: number): Promise<ProductColorImage[]>;
  createProductColorImage(productColorImage: InsertProductColorImage): Promise<ProductColorImage>;
  updateProductColorImage(id: number, updates: Partial<InsertProductColorImage>): Promise<ProductColorImage>;
  deleteProductColorImage(id: number): Promise<void>;
  clearProductColorImages(productId: number): Promise<void>;
  
  // Order operations
  getOrders(filters?: {
    customerId?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrderWithItems(id: number): Promise<(Order & { items: OrderItem[] }) | undefined>;
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order>;
  
  // Quote operations
  getQuotes(customerId?: string): Promise<Quote[]>;
  getQuote(id: number): Promise<Quote | undefined>;
  createQuote(quote: InsertQuote): Promise<Quote>;
  updateQuote(id: number, updates: Partial<InsertQuote>): Promise<Quote>;
  
  // Promotions operations
  getPromotions(activeOnly?: boolean): Promise<Promotion[]>;
  getPromotion(id: number): Promise<Promotion | undefined>;
  createPromotion(promotion: InsertPromotion): Promise<Promotion>;
  updatePromotion(id: number, updates: Partial<InsertPromotion>): Promise<Promotion>;
  deletePromotion(id: number): Promise<void>;
  getActivePromotions(): Promise<Promotion[]>;
  
  // Industry sections operations
  getIndustrySections(activeOnly?: boolean): Promise<IndustrySection[]>;
  getIndustrySection(id: number): Promise<IndustrySection | undefined>;
  createIndustrySection(section: InsertIndustrySection): Promise<IndustrySection>;
  updateIndustrySection(id: number, updates: Partial<InsertIndustrySection>): Promise<IndustrySection>;
  deleteIndustrySection(id: number): Promise<void>;
  
  // Company operations
  getCompanies(activeOnly?: boolean): Promise<Company[]>;
  getCompany(id: number): Promise<Company | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: number, updates: Partial<InsertCompany>): Promise<Company>;
  
  // Company type operations
  getCompanyTypes(activeOnly?: boolean): Promise<CompanyType[]>;
  getCompanyType(id: number): Promise<CompanyType | undefined>;
  createCompanyType(companyType: InsertCompanyType): Promise<CompanyType>;
  updateCompanyType(id: number, updates: Partial<InsertCompanyType>): Promise<CompanyType>;
  deleteCompanyType(id: number): Promise<void>;
  
  // Product pricing operations
  getProductPricing(productId: number): Promise<ProductPricing[]>;
  setProductPricing(productId: number, pricing: Array<Omit<InsertProductPricing, 'productId'>>): Promise<ProductPricing[]>;
  getProductPriceForCompanyType(productId: number, companyTypeId: number): Promise<string>;
  
  // Customer management
  getCustomers(): Promise<(LocalUser & { companyName?: string })[]>;

  // Analytics
  getDashboardStats(): Promise<{
    totalSales: string;
    newOrders: number;
    activeProducts: number;
    totalCustomers: number;
  }>;
  getTopProducts(limit?: number): Promise<Array<Product & { salesCount: number; revenue: string }>>;
  getRecentOrders(limit?: number): Promise<Order[]>;
  
  // Contact messages operations
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  markContactMessageAsRead(id: number): Promise<ContactMessage>;
  getUnreadContactMessagesCount(): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getLocalUser(id: number): Promise<LocalUser | undefined> {
    const [user] = await db.select().from(localUsers).where(eq(localUsers.id, id));
    return user;
  }

  async getCustomers(): Promise<(LocalUser & { companyName?: string })[]> {
    const result = await db
      .select({
        id: localUsers.id,
        username: localUsers.username,
        email: localUsers.email,
        firstName: localUsers.firstName,
        lastName: localUsers.lastName,
        role: localUsers.role,
        isActive: localUsers.isActive,
        createdAt: localUsers.createdAt,
        lastLogin: localUsers.lastLogin,
        companyId: localUsers.companyId,
        companyName: companies.name,
      })
      .from(localUsers)
      .leftJoin(companies, eq(localUsers.companyId, companies.id))
      .where(eq(localUsers.role, 'customer'));
    
    return result;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Local authentication operations
  async getLocalUserByUsername(username: string): Promise<LocalUser | undefined> {
    const [user] = await db.select().from(localUsers).where(eq(localUsers.username, username));
    return user;
  }

  async getLocalUserByEmail(email: string): Promise<LocalUser | undefined> {
    const [user] = await db.select().from(localUsers).where(eq(localUsers.email, email));
    return user;
  }

  async getLocalUserById(id: number): Promise<LocalUser | undefined> {
    const [user] = await db.select().from(localUsers).where(eq(localUsers.id, id));
    return user;
  }

  async createLocalUser(userData: InsertLocalUser): Promise<LocalUser> {
    const [user] = await db.insert(localUsers).values(userData).returning();
    return user;
  }

  async updateLocalUserLastLogin(id: number): Promise<void> {
    await db
      .update(localUsers)
      .set({ lastLogin: new Date() })
      .where(eq(localUsers.id, id));
  }

  async updateCustomerCompany(customerId: string | number, companyId: number | null): Promise<void> {
    const customerIdNum = typeof customerId === 'string' ? parseInt(customerId) : customerId;
    await db
      .update(localUsers)
      .set({ companyId })
      .where(eq(localUsers.id, customerIdNum));
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(categories.name);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  // Brand operations
  async getBrands(): Promise<Brand[]> {
    return await db.select().from(brands).orderBy(brands.name);
  }

  async createBrand(brand: InsertBrand): Promise<Brand> {
    const [newBrand] = await db.insert(brands).values(brand).returning();
    return newBrand;
  }

  async updateBrand(id: number, updates: Partial<InsertBrand>): Promise<Brand> {
    const [updatedBrand] = await db
      .update(brands)
      .set(updates)
      .where(eq(brands.id, id))
      .returning();
    return updatedBrand;
  }

  async deleteBrand(id: number): Promise<void> {
    await db.delete(brands).where(eq(brands.id, id));
  }

  // Helper method to get brand name by ID
  async getBrandName(brandId: number): Promise<string | null> {
    const [brand] = await db.select({ name: brands.name }).from(brands).where(eq(brands.id, brandId));
    return brand?.name || null;
  }

  // Size operations
  async getSizes(): Promise<Size[]> {
    return await db.select().from(sizes).orderBy(sizes.sortOrder, sizes.name);
  }

  async createSize(size: InsertSize): Promise<Size> {
    const [newSize] = await db.insert(sizes).values(size).returning();
    return newSize;
  }

  // Color operations
  async getColors(): Promise<Color[]> {
    return await db.select().from(colors).orderBy(colors.name);
  }

  async createColor(color: InsertColor): Promise<Color> {
    const [newColor] = await db.insert(colors).values(color).returning();
    return newColor;
  }

  // Garment type operations
  async getGarmentTypes(): Promise<GarmentType[]> {
    return db.select().from(garmentTypes).where(eq(garmentTypes.isActive, true));
  }

  async createGarmentType(garmentType: InsertGarmentType): Promise<GarmentType> {
    const [newGarmentType] = await db.insert(garmentTypes).values(garmentType).returning();
    return newGarmentType;
  }

  // Product operations
  async getProducts(filters?: {
    categoryId?: number;
    brandId?: number;
    gender?: string;
    garmentTypeId?: number;
    isActive?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<any[]> {
    let query = db.select().from(products);
    
    const conditions = [];
    
    if (filters?.categoryId) {
      conditions.push(eq(products.categoryId, filters.categoryId));
    }
    
    if (filters?.brandId) {
      // First try to find brand by ID, then use brand name
      const brandName = await this.getBrandName(filters.brandId);
      if (brandName) {
        conditions.push(eq(products.brand, brandName));
      }
    }
    
    if (filters?.gender) {
      // Check if the gender is included in the genders array
      conditions.push(arrayContains(products.genders, [filters.gender]));
    }
    
    if (filters?.garmentTypeId) {
      conditions.push(eq(products.garmentTypeId, filters.garmentTypeId));
    }
    
    if (filters?.isActive !== undefined) {
      conditions.push(eq(products.isActive, filters.isActive));
    }
    
    if (filters?.search) {
      conditions.push(ilike(products.name, `%${filters.search}%`));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    query = query.orderBy(desc(products.createdAt));
    
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    
    if (filters?.offset) {
      query = query.offset(filters.offset);
    }
    
    const baseProducts = await query;

    // Enrich products with color-image associations
    const enrichedProducts = await Promise.all(
      baseProducts.map(async (product) => {
        // Get color images for this product
        const colorImages = await this.getProductColorImages(product.id);
        
        // Get all available colors
        const allColors = await this.getColors();
        
        // Create color map with images
        const colorImageMap = new Map();
        colorImages.forEach(ci => {
          const color = allColors.find(c => c.id === ci.colorId);
          if (color) {
            colorImageMap.set(color.name, {
              id: color.id,
              name: color.name,
              hexCode: color.hexCode,
              images: ci.images
            });
          }
        });
        
        // Get primary image - first try color images, then fallback to product images
        let primaryImage = '';
        if (colorImages.length > 0) {
          const primaryColorImage = colorImages.find(ci => ci.isPrimary) || colorImages[0];
          primaryImage = primaryColorImage.images[0] || '';
        }
        if (!primaryImage && product.images?.length > 0) {
          primaryImage = product.images[0];
        }
        
        return {
          ...product,
          colorImages: Array.from(colorImageMap.values()),
          primaryImage
        };
      })
    );
    
    return enrichedProducts;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product> {
    const [updatedProduct] = await db
      .update(products)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // Inventory operations
  async getInventory(productId: number): Promise<Inventory[]> {
    return await db.select().from(inventory).where(eq(inventory.productId, productId));
  }

  async updateInventory(productId: number, size: string, color: string, quantity: number): Promise<Inventory> {
    const [existingInventory] = await db
      .select()
      .from(inventory)
      .where(
        and(
          eq(inventory.productId, productId),
          eq(inventory.size, size),
          eq(inventory.color, color)
        )
      );

    if (existingInventory) {
      const [updated] = await db
        .update(inventory)
        .set({ quantity, updatedAt: new Date() })
        .where(eq(inventory.id, existingInventory.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(inventory)
        .values({ productId, size, color, quantity })
        .returning();
      return created;
    }
  }

  // Product color images operations
  async getProductColorImages(productId: number): Promise<ProductColorImage[]> {
    return await db.select().from(productColorImages).where(eq(productColorImages.productId, productId));
  }

  async createProductColorImage(productColorImage: InsertProductColorImage): Promise<ProductColorImage> {
    const [created] = await db
      .insert(productColorImages)
      .values(productColorImage)
      .returning();
    return created;
  }

  async updateProductColorImage(id: number, updates: Partial<InsertProductColorImage>): Promise<ProductColorImage> {
    const [updated] = await db
      .update(productColorImages)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(productColorImages.id, id))
      .returning();
    return updated;
  }

  async deleteProductColorImage(id: number): Promise<void> {
    await db.delete(productColorImages).where(eq(productColorImages.id, id));
  }

  async clearProductColorImages(productId: number): Promise<void> {
    await db.delete(productColorImages).where(eq(productColorImages.productId, productId));
  }

  // Order operations
  async getOrders(filters?: {
    customerId?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<Order[]> {
    let query = db.select().from(orders);
    
    const conditions = [];
    
    if (filters?.customerId) {
      conditions.push(eq(orders.customerId, filters.customerId));
    }
    
    if (filters?.status) {
      conditions.push(eq(orders.status, filters.status as any));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    query = query.orderBy(desc(orders.createdAt));
    
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    
    if (filters?.offset) {
      query = query.offset(filters.offset);
    }
    
    return await query;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getOrderWithItems(id: number): Promise<(Order & { items: OrderItem[] }) | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    if (!order) return undefined;
    
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
    
    return { ...order, items };
  }

  async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    // Generate order number
    const orderNumber = `UL-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    
    const [newOrder] = await db
      .insert(orders)
      .values({ ...order, orderNumber })
      .returning();

    // Insert order items
    const orderItemsData = items.map(item => ({
      ...item,
      orderId: newOrder.id,
    }));
    
    await db.insert(orderItems).values(orderItemsData);
    
    return newOrder;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ status: status as any, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  // Quote operations
  async getQuotes(customerId?: string): Promise<any[]> {
    // First get the quotes
    let quotesQuery = db.select().from(quotes);
    
    if (customerId) {
      quotesQuery = quotesQuery.where(eq(quotes.customerId, customerId));
    }
    
    const quotesResult = await quotesQuery.orderBy(desc(quotes.createdAt));
    
    // Then get customer info for each quote
    const enrichedQuotes = await Promise.all(
      quotesResult.map(async (quote) => {
        let customerInfo = {
          customerName: null,
          customerEmail: null,
          customerCompany: null,
        };
        
        if (quote.customerId) {
          const [customer] = await db
            .select({
              email: localUsers.email,
              firstName: localUsers.firstName,
              lastName: localUsers.lastName,
              companyId: localUsers.companyId,
            })
            .from(localUsers)
            .where(eq(localUsers.id, parseInt(quote.customerId)));
            
          if (customer) {
            customerInfo = {
              customerName: `${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
              customerEmail: customer.email,
              customerCompany: null, // Will be fetched from company table using companyId
            };
          }
        }
        
        return {
          ...quote,
          ...customerInfo,
        };
      })
    );
    
    return enrichedQuotes;
  }

  async getQuote(id: number): Promise<Quote | undefined> {
    const [quote] = await db.select().from(quotes).where(eq(quotes.id, id));
    return quote;
  }

  async createQuote(quote: InsertQuote): Promise<Quote> {
    const [newQuote] = await db
      .insert(quotes)
      .values(quote)
      .returning();
    return newQuote;
  }

  async updateQuote(id: number, updates: Partial<InsertQuote>): Promise<Quote> {
    const [updatedQuote] = await db
      .update(quotes)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(quotes.id, id))
      .returning();
    return updatedQuote;
  }

  // Analytics
  async getDashboardStats(): Promise<{
    totalSales: string;
    newOrders: number;
    activeProducts: number;
    totalCustomers: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get today's sales
    const [salesResult] = await db
      .select({
        total: sql<string>`COALESCE(SUM(${orders.total}), 0)`,
      })
      .from(orders)
      .where(
        and(
          sql`${orders.createdAt} >= ${today}`,
          eq(orders.status, "delivered")
        )
      );

    // Get new orders count
    const [ordersResult] = await db
      .select({ count: count() })
      .from(orders)
      .where(eq(orders.status, "pending"));

    // Get active products count
    const [productsResult] = await db
      .select({ count: count() })
      .from(products)
      .where(eq(products.isActive, true));

    // Get total customers count
    const [customersResult] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.role, "customer"));

    return {
      totalSales: salesResult?.total || "0",
      newOrders: ordersResult?.count || 0,
      activeProducts: productsResult?.count || 0,
      totalCustomers: customersResult?.count || 0,
    };
  }

  async getTopProducts(limit = 5): Promise<Array<Product & { salesCount: number; revenue: string }>> {
    const result = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        categoryId: products.categoryId,
        price: products.price,
        images: products.images,
        sizes: products.sizes,
        colors: products.colors,
        isActive: products.isActive,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        salesCount: sql<number>`CAST(COALESCE(SUM(${orderItems.quantity}), 0) AS INTEGER)`,
        revenue: sql<string>`COALESCE(SUM(${orderItems.totalPrice}), 0)`,
      })
      .from(products)
      .leftJoin(orderItems, eq(products.id, orderItems.productId))
      .groupBy(products.id)
      .orderBy(sql<number>`CAST(COALESCE(SUM(${orderItems.quantity}), 0) AS INTEGER) DESC`)
      .limit(limit);

    return result;
  }

  async getRecentOrders(limit = 10): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(limit);
  }

  // Sales Analytics Methods - Simplified version
  async getSalesSummary(dateRange = '30days'): Promise<{
    totalSales: number;
    totalOrders: number;
    averageOrderValue: number;
    salesGrowth: number;
    topProducts: Array<{
      id: number;
      name: string;
      totalSold: number;
      revenue: number;
    }>;
    salesByPeriod: Array<{
      period: string;
      sales: number;
      orders: number;
    }>;
    salesByCategory: Array<{
      category: string;
      sales: number;
      percentage: number;
    }>;
  }> {
    try {
      // Get basic order stats
      const orderResults = await db
        .select({
          totalSales: sql<string>`COALESCE(SUM(${orders.total}), 0)`,
          totalOrders: sql<number>`COUNT(*)`,
        })
        .from(orders)
        .where(sql`${orders.status} != 'cancelled'`);

      const totalSales = parseFloat(orderResults[0]?.totalSales || '0');
      const totalOrders = Number(orderResults[0]?.totalOrders || 0);
      const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

      // Mock data for now - in a real implementation, these would be calculated
      return {
        totalSales,
        totalOrders,
        averageOrderValue,
        salesGrowth: 15.5, // Mock growth percentage
        topProducts: [
          { id: 1, name: 'Polo Corporativo', totalSold: 150, revenue: 4500 },
          { id: 2, name: 'Playera Industrial', totalSold: 120, revenue: 3600 },
          { id: 3, name: 'Uniforme Médico', totalSold: 100, revenue: 5000 },
          { id: 4, name: 'Camisa Gastronomía', totalSold: 80, revenue: 2400 },
          { id: 5, name: 'Chaleco Seguridad', totalSold: 60, revenue: 1800 }
        ],
        salesByPeriod: [
          { period: '2025-01-05', sales: 1200, orders: 8 },
          { period: '2025-01-06', sales: 1500, orders: 10 },
          { period: '2025-01-07', sales: 900, orders: 6 },
          { period: '2025-01-08', sales: 1800, orders: 12 },
          { period: '2025-01-09', sales: 2100, orders: 14 },
          { period: '2025-01-10', sales: 1650, orders: 11 },
          { period: '2025-01-11', sales: 1950, orders: 13 }
        ],
        salesByCategory: [
          { category: 'Corporativo', sales: 8500, percentage: 35 },
          { category: 'Industrial', sales: 6200, percentage: 25 },
          { category: 'Médico', sales: 4800, percentage: 20 },
          { category: 'Gastronomía', sales: 2900, percentage: 12 },
          { category: 'Seguridad', sales: 1600, percentage: 8 }
        ]
      };
    } catch (error) {
      console.error('Error getting sales summary:', error);
      // Return default values on error
      return {
        totalSales: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        salesGrowth: 0,
        topProducts: [],
        salesByPeriod: [],
        salesByCategory: []
      };
    }
  }

  async getSalesAnalytics(filters: any): Promise<any> {
    try {
      // Simplified analytics data
      return [
        { date: '2025-01-05', sales: 1200, orderCount: 8 },
        { date: '2025-01-06', sales: 1500, orderCount: 10 },
        { date: '2025-01-07', sales: 900, orderCount: 6 },
        { date: '2025-01-08', sales: 1800, orderCount: 12 },
        { date: '2025-01-09', sales: 2100, orderCount: 14 },
        { date: '2025-01-10', sales: 1650, orderCount: 11 },
        { date: '2025-01-11', sales: 1950, orderCount: 13 }
      ];
    } catch (error) {
      console.error('Error getting sales analytics:', error);
      return [];
    }
  }

  async getSalesTrends(filters: any): Promise<any> {
    try {
      // Simplified trends data
      return [
        { period: '2025-01-05', sales: 1200, orders: 8, averageOrderValue: 150 },
        { period: '2025-01-06', sales: 1500, orders: 10, averageOrderValue: 150 },
        { period: '2025-01-07', sales: 900, orders: 6, averageOrderValue: 150 },
        { period: '2025-01-08', sales: 1800, orders: 12, averageOrderValue: 150 },
        { period: '2025-01-09', sales: 2100, orders: 14, averageOrderValue: 150 },
        { period: '2025-01-10', sales: 1650, orders: 11, averageOrderValue: 150 },
        { period: '2025-01-11', sales: 1950, orders: 13, averageOrderValue: 150 }
      ];
    } catch (error) {
      console.error('Error getting sales trends:', error);
      return [];
    }
  }

  // Product Color Images operations
  async getProductColorImages(productId: number) {
    return await db
      .select()
      .from(productColorImages)
      .where(eq(productColorImages.productId, productId))
      .orderBy(productColorImages.sortOrder);
  }

  async createProductColorImage(data: any) {
    const [colorImage] = await db
      .insert(productColorImages)
      .values(data)
      .returning();
    return colorImage;
  }

  async updateProductColorImage(id: number, data: any) {
    const [colorImage] = await db
      .update(productColorImages)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(productColorImages.id, id))
      .returning();
    return colorImage;
  }

  async deleteProductColorImage(id: number) {
    await db
      .delete(productColorImages)
      .where(eq(productColorImages.id, id));
  }

  async clearProductColorImages(productId: number) {
    await db
      .delete(productColorImages)
      .where(eq(productColorImages.productId, productId));
  }

  // Promotions operations
  async getPromotions(activeOnly = false): Promise<Promotion[]> {
    let query = db.select().from(promotions);
    
    if (activeOnly) {
      const now = new Date();
      query = query.where(
        and(
          eq(promotions.isActive, true),
          lte(promotions.startDate, now),
          gte(promotions.endDate, now)
        )
      );
    }
    
    return await query.orderBy(promotions.sortOrder, promotions.createdAt);
  }

  async getPromotion(id: number): Promise<Promotion | undefined> {
    const [promotion] = await db.select().from(promotions).where(eq(promotions.id, id));
    return promotion;
  }

  async createPromotion(promotion: InsertPromotion): Promise<Promotion> {
    const [created] = await db
      .insert(promotions)
      .values(promotion)
      .returning();
    return created;
  }

  async updatePromotion(id: number, updates: Partial<InsertPromotion>): Promise<Promotion> {
    const [updated] = await db
      .update(promotions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(promotions.id, id))
      .returning();
    return updated;
  }

  async deletePromotion(id: number): Promise<void> {
    await db.delete(promotions).where(eq(promotions.id, id));
  }

  async getActivePromotions(): Promise<Promotion[]> {
    const now = new Date();
    return await db
      .select()
      .from(promotions)
      .where(
        and(
          eq(promotions.isActive, true),
          lte(promotions.startDate, now),
          gte(promotions.endDate, now)
        )
      )
      .orderBy(promotions.sortOrder, promotions.createdAt);
  }

  // Industry sections operations
  async getIndustrySections(activeOnly = false): Promise<IndustrySection[]> {
    let query = db.select().from(industrySections);
    
    if (activeOnly) {
      query = query.where(eq(industrySections.isActive, true));
    }
    
    return await query.orderBy(industrySections.sortOrder, industrySections.createdAt);
  }

  async getIndustrySection(id: number): Promise<IndustrySection | undefined> {
    const [section] = await db.select().from(industrySections).where(eq(industrySections.id, id));
    return section;
  }

  async createIndustrySection(section: InsertIndustrySection): Promise<IndustrySection> {
    const [created] = await db
      .insert(industrySections)
      .values(section)
      .returning();
    return created;
  }

  async updateIndustrySection(id: number, updates: Partial<InsertIndustrySection>): Promise<IndustrySection> {
    const [updated] = await db
      .update(industrySections)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(industrySections.id, id))
      .returning();
    return updated;
  }

  async deleteIndustrySection(id: number): Promise<void> {
    await db.delete(industrySections).where(eq(industrySections.id, id));
  }

  // Company operations
  async getCompanies(activeOnly = false): Promise<Company[]> {
    let query = db.select().from(companies);
    
    if (activeOnly) {
      query = query.where(eq(companies.isActive, true));
    }
    
    return await query.orderBy(companies.name);
  }

  async getCompany(id: number): Promise<Company | undefined> {
    const [company] = await db.select().from(companies).where(eq(companies.id, id));
    return company;
  }

  async createCompany(company: InsertCompany): Promise<Company> {
    const [created] = await db
      .insert(companies)
      .values(company)
      .returning();
    return created;
  }

  async updateCompany(id: number, updates: Partial<InsertCompany>): Promise<Company> {
    const [updated] = await db
      .update(companies)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(companies.id, id))
      .returning();
    return updated;
  }

  async deleteCompany(id: number): Promise<boolean> {
    const result = await db.delete(companies).where(eq(companies.id, id));
    return result.rowCount || 0 > 0;
  }

  // Company type operations
  async getCompanyTypes(activeOnly = false): Promise<CompanyType[]> {
    let query = db.select().from(companyTypes);
    
    if (activeOnly) {
      query = query.where(eq(companyTypes.isActive, true));
    }
    
    return await query.orderBy(companyTypes.sortOrder, companyTypes.name);
  }

  async getCompanyType(id: number): Promise<CompanyType | undefined> {
    const [companyType] = await db.select().from(companyTypes).where(eq(companyTypes.id, id));
    return companyType;
  }

  async createCompanyType(companyType: InsertCompanyType): Promise<CompanyType> {
    const [created] = await db
      .insert(companyTypes)
      .values(companyType)
      .returning();
    return created;
  }

  async updateCompanyType(id: number, updates: Partial<InsertCompanyType>): Promise<CompanyType> {
    const [updated] = await db
      .update(companyTypes)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(companyTypes.id, id))
      .returning();
    return updated;
  }

  async deleteCompanyType(id: number): Promise<void> {
    await db.delete(companyTypes).where(eq(companyTypes.id, id));
  }

  // Product pricing operations
  async getProductPricing(productId: number): Promise<ProductPricing[]> {
    return await db.select().from(productPricing).where(eq(productPricing.productId, productId));
  }

  async setProductPricing(productId: number, pricing: Array<Omit<InsertProductPricing, 'productId'>>): Promise<ProductPricing[]> {
    // First, delete existing pricing for this product
    await db.delete(productPricing).where(eq(productPricing.productId, productId));
    
    // Insert new pricing
    if (pricing.length > 0) {
      const pricingData = pricing.map(p => ({ ...p, productId }));
      const created = await db
        .insert(productPricing)
        .values(pricingData)
        .returning();
      return created;
    }
    
    return [];
  }

  async getProductPriceForCompanyType(productId: number, companyTypeId: number): Promise<string> {
    const [pricing] = await db
      .select()
      .from(productPricing)
      .where(
        and(
          eq(productPricing.productId, productId),
          eq(productPricing.companyTypeId, companyTypeId),
          eq(productPricing.isActive, true)
        )
      );
    
    if (pricing) {
      return pricing.price;
    }
    
    // Fallback to base product price
    const [product] = await db.select({ price: products.price }).from(products).where(eq(products.id, productId));
    return product?.price || "0";
  }

  // Contact messages operations
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [created] = await db
      .insert(contactMessages)
      .values(message)
      .returning();
    return created;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return await db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt));
  }

  async markContactMessageAsRead(id: number): Promise<ContactMessage> {
    const [updated] = await db
      .update(contactMessages)
      .set({ isRead: true, respondedAt: new Date() })
      .where(eq(contactMessages.id, id))
      .returning();
    return updated;
  }

  async getUnreadContactMessagesCount(): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(contactMessages)
      .where(eq(contactMessages.isRead, false));
    return result.count;
  }
}

export const storage = new DatabaseStorage();

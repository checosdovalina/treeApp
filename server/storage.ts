import {
  users,
  products,
  categories,
  brands,
  sizes,
  colors,
  inventory,
  orders,
  orderItems,
  quotes,
  type User,
  type UpsertUser,
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
  type Inventory,
  type InsertInventory,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type Quote,
  type InsertQuote,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, ilike, count } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
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
  
  // Analytics
  getDashboardStats(): Promise<{
    totalSales: string;
    newOrders: number;
    activeProducts: number;
    totalCustomers: number;
  }>;
  getTopProducts(limit?: number): Promise<Array<Product & { salesCount: number; revenue: string }>>;
  getRecentOrders(limit?: number): Promise<Order[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
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

  // Product operations
  async getProducts(filters?: {
    categoryId?: number;
    brandId?: number;
    gender?: string;
    isActive?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Product[]> {
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
      conditions.push(eq(products.gender, filters.gender as any));
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
    
    return await query;
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
  async getQuotes(customerId?: string): Promise<Quote[]> {
    let query = db.select().from(quotes);
    
    if (customerId) {
      query = query.where(eq(quotes.customerId, customerId));
    }
    
    return await query.orderBy(desc(quotes.createdAt));
  }

  async getQuote(id: number): Promise<Quote | undefined> {
    const [quote] = await db.select().from(quotes).where(eq(quotes.id, id));
    return quote;
  }

  async createQuote(quote: InsertQuote): Promise<Quote> {
    // Generate quote number
    const quoteNumber = `QT-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    
    const [newQuote] = await db
      .insert(quotes)
      .values({ ...quote, quoteNumber })
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
}

export const storage = new DatabaseStorage();

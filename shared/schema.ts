import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Local authentication table
export const localUsers = pgTable("local_users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(), // hashed password
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  role: varchar("role").notNull().default("customer"), // admin, customer
  phone: varchar("phone", { length: 20 }),
  companyId: integer("company_id").references(() => companies.id),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  zipCode: varchar("zip_code", { length: 10 }),
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User storage table (required for Replit Auth - keeping for compatibility)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default("customer"), // admin, customer
  phone: varchar("phone", { length: 20 }),
  companyId: integer("company_id").references(() => companies.id),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  zipCode: varchar("zip_code", { length: 10 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Company types table
export const companyTypes = pgTable("company_types", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  discountPercentage: decimal("discount_percentage", { precision: 5, scale: 2 }).default("0"), // Descuento general por tipo
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Companies table
export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull().unique(),
  legalName: varchar("legal_name", { length: 250 }), // Razón social completa
  taxId: varchar("tax_id", { length: 50 }), // RFC o número de identificación fiscal
  taxRegime: varchar("tax_regime", { length: 100 }), // Régimen fiscal
  industry: varchar("industry", { length: 100 }), // tipo de industria
  businessType: varchar("business_type", { length: 50 }), // S.A. de C.V., S.R.L., etc.
  companyTypeId: integer("company_type_id").references(() => companyTypes.id), // Tipo de empresa para precios
  contactEmail: varchar("contact_email"),
  contactPhone: varchar("contact_phone", { length: 20 }),
  contactPerson: varchar("contact_person", { length: 150 }), // Nombre del contacto principal
  billingEmail: varchar("billing_email"), // Email para facturación
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  zipCode: varchar("zip_code", { length: 10 }),
  country: varchar("country", { length: 100 }).default("México"),
  website: varchar("website", { length: 255 }),
  employeeCount: integer("employee_count"), // Número de empleados
  foundedYear: integer("founded_year"),
  notes: text("notes"),
  paymentTerms: varchar("payment_terms", { length: 100 }), // Términos de pago (15 días, 30 días, etc.)
  creditLimit: decimal("credit_limit", { precision: 10, scale: 2 }), // Límite de crédito
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Product categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Brands table
export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  logo: text("logo"), // URL or base64 image
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Sizes table
export const sizes = pgTable("sizes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 20 }).notNull().unique(),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Colors table
export const colors = pgTable("colors", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  hexCode: varchar("hex_code", { length: 7 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Garment types table
export const garmentTypes = pgTable("garment_types", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  displayName: varchar("display_name", { length: 100 }).notNull(),
  requiresSizes: boolean("requires_sizes").default(true), // Si el tipo de prenda requiere tallas
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Size ranges by gender and garment type
export const sizeRanges = pgTable("size_ranges", {
  id: serial("id").primaryKey(),
  garmentTypeId: integer("garment_type_id").references(() => garmentTypes.id),
  gender: varchar("gender", { length: 20 }).notNull(), // masculino, femenino, unisex
  sizeType: varchar("size_type", { length: 50 }).notNull(), // waist, clothing, shoes, etc.
  minSize: integer("min_size"),
  maxSize: integer("max_size"),
  sizeList: text("size_list").array(), // for non-numeric sizes like XS, S, M, L, XL
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Gender enum
export const genderEnum = pgEnum("gender", ["masculino", "femenino", "unisex"]);

// Products table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  sku: varchar("sku", { length: 50 }).unique(),
  description: text("description"),
  categoryId: integer("category_id").references(() => categories.id),
  brand: varchar("brand", { length: 100 }),
  gender: genderEnum("gender"), // Keep existing column with enum type for compatibility
  genders: text("genders").array().default([]).notNull(), // New array column for multiple genders
  garmentTypeId: integer("garment_type_id").references(() => garmentTypes.id),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(), // Precio base/regular
  images: text("images").array().default([]),
  sizes: text("sizes").array().default([]),
  colors: text("colors").array().default([]),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Product pricing by company type table
export const productPricing = pgTable("product_pricing", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  companyTypeId: integer("company_type_id").references(() => companyTypes.id).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Product color images table - to store specific images for each color
export const productColorImages = pgTable("product_color_images", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  colorId: integer("color_id").references(() => colors.id).notNull(),
  images: text("images").array().default([]).notNull(), // Array of image URLs for this color
  isPrimary: boolean("is_primary").default(false), // Primary color for product display
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Inventory tracking
export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id),
  size: varchar("size", { length: 20 }),
  color: varchar("color", { length: 50 }),
  quantity: integer("quantity").notNull().default(0),
  reservedQuantity: integer("reserved_quantity").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Order status enum
export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);

// Orders table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
  customerId: varchar("customer_id"), // Removed foreign key constraint to support both auth systems
  customerEmail: varchar("customer_email"),
  customerName: varchar("customer_name"),
  customerPhone: varchar("customer_phone"),
  status: orderStatusEnum("status").default("pending"),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  shipping: decimal("shipping", { precision: 10, scale: 2 }).default("0"),
  tax: decimal("tax", { precision: 10, scale: 2 }).default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  shippingAddress: jsonb("shipping_address"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Order items
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  productId: integer("product_id").references(() => products.id),
  productName: varchar("product_name", { length: 200 }),
  size: varchar("size", { length: 20 }),
  color: varchar("color", { length: 50 }),
  gender: varchar("gender", { length: 20 }), // Add gender selection for orders
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
});

// Quotes/Budgets
export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  quoteNumber: varchar("quote_number", { length: 50 }).notNull().unique(),
  customerId: varchar("customer_id").references(() => users.id),
  customerEmail: varchar("customer_email"),
  customerName: varchar("customer_name"),
  customerCompany: varchar("customer_company"),
  items: jsonb("items"), // Array of quote items
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  tax: decimal("tax", { precision: 10, scale: 2 }).default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  validUntil: timestamp("valid_until"),
  notes: text("notes"),
  status: varchar("status").default("draft"), // draft, sent, accepted, expired
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Promotions
export const promotions = pgTable("promotions", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  imageUrl: varchar("image_url", { length: 500 }),
  linkUrl: varchar("link_url", { length: 500 }),
  discountType: varchar("discount_type", { length: 20 }), // percentage, fixed, free_shipping
  discountValue: decimal("discount_value", { precision: 10, scale: 2 }),
  promoCode: varchar("promo_code", { length: 50 }),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  targetAudience: varchar("target_audience", { length: 50 }).default("all"), // all, new_customers, returning_customers
  backgroundColor: varchar("background_color", { length: 7 }).default("#1F4287"),
  textColor: varchar("text_color", { length: 7 }).default("#FFFFFF"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contact messages table
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  subject: varchar("subject", { length: 300 }).notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  respondedAt: timestamp("responded_at"),
  response: text("response"),
});

// Industry sections - configurable homepage sections for different industries
export const industrySections = pgTable("industry_sections", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  subtitle: text("subtitle"),
  industry: varchar("industry", { length: 100 }).notNull(), // corporativo, gastronomia, industrial, etc.
  description: text("description"),
  imageUrl: varchar("image_url", { length: 500 }),
  backgroundColor: varchar("background_color", { length: 7 }).notNull(),
  textColor: varchar("text_color", { length: 7 }).default("#FFFFFF"),
  linkUrl: varchar("link_url", { length: 500 }),
  buttonText: varchar("button_text", { length: 100 }).default("Explorar productos"),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  garmentType: one(garmentTypes, {
    fields: [products.garmentTypeId],
    references: [garmentTypes.id],
  }),
  inventory: many(inventory),
  orderItems: many(orderItems),
  colorImages: many(productColorImages),
  pricing: many(productPricing),
}));

export const productColorImagesRelations = relations(productColorImages, ({ one }) => ({
  product: one(products, {
    fields: [productColorImages.productId],
    references: [products.id],
  }),
  color: one(colors, {
    fields: [productColorImages.colorId],
    references: [colors.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

export const sizesRelations = relations(sizes, ({ many }) => ({
  inventory: many(inventory),
}));

export const colorsRelations = relations(colors, ({ many }) => ({
  inventory: many(inventory),
  productImages: many(productColorImages),
}));

export const garmentTypesRelations = relations(garmentTypes, ({ many }) => ({
  products: many(products),
  sizeRanges: many(sizeRanges),
}));

export const sizeRangesRelations = relations(sizeRanges, ({ one }) => ({
  garmentType: one(garmentTypes, {
    fields: [sizeRanges.garmentTypeId],
    references: [garmentTypes.id],
  }),
}));

export const inventoryRelations = relations(inventory, ({ one }) => ({
  product: one(products, {
    fields: [inventory.productId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(users, {
    fields: [orders.customerId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const quotesRelations = relations(quotes, ({ one }) => ({
  customer: one(users, {
    fields: [quotes.customerId],
    references: [users.id],
  }),
}));

export const companyTypesRelations = relations(companyTypes, ({ many }) => ({
  companies: many(companies),
  productPricing: many(productPricing),
}));

export const companiesRelations = relations(companies, ({ one, many }) => ({
  companyType: one(companyTypes, {
    fields: [companies.companyTypeId],
    references: [companyTypes.id],
  }),
  localUsers: many(localUsers),
  users: many(users),
}));

export const productPricingRelations = relations(productPricing, ({ one }) => ({
  product: one(products, {
    fields: [productPricing.productId],
    references: [products.id],
  }),
  companyType: one(companyTypes, {
    fields: [productPricing.companyTypeId],
    references: [companyTypes.id],
  }),
}));

export const localUsersRelations = relations(localUsers, ({ one }) => ({
  company: one(companies, {
    fields: [localUsers.companyId],
    references: [companies.id],
  }),
}));

export const usersRelations = relations(users, ({ one }) => ({
  company: one(companies, {
    fields: [users.companyId],
    references: [companies.id],
  }),
}));

// Insert schemas
export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});

export const insertBrandSchema = createInsertSchema(brands).omit({
  id: true,
  createdAt: true,
});

export const insertSizeSchema = createInsertSchema(sizes).omit({
  id: true,
  createdAt: true,
});

export const insertColorSchema = createInsertSchema(colors).omit({
  id: true,
  createdAt: true,
});

export const insertGarmentTypeSchema = createInsertSchema(garmentTypes).omit({
  id: true,
  createdAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInventorySchema = createInsertSchema(inventory).omit({
  id: true,
  updatedAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  orderNumber: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
});

export const insertProductColorImageSchema = createInsertSchema(productColorImages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPromotionSchema = createInsertSchema(promotions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  startDate: z.union([z.date(), z.string().transform((str) => new Date(str))]),
  endDate: z.union([z.date(), z.string().transform((str) => new Date(str))]),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
});

export const insertIndustrySectionSchema = createInsertSchema(industrySections).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  companyTypeId: z.number().optional().nullable(),
  employeeCount: z.number().optional().nullable(),
  foundedYear: z.number().optional().nullable(),
  creditLimit: z.string().optional().nullable(),
});

export const insertCompanyTypeSchema = createInsertSchema(companyTypes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductPricingSchema = createInsertSchema(productPricing).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertQuoteSchema = createInsertSchema(quotes).omit({
  id: true,
  quoteNumber: true,
  createdAt: true,
  updatedAt: true,
});

// Customer registration schema
export const customerRegistrationSchema = z.object({
  firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string(),
  phone: z.string().min(10, "El teléfono debe tener al menos 10 dígitos"),
  companyId: z.number().optional(),
  newCompany: z.preprocess((val) => {
    // Convert empty object or object with empty strings to undefined
    if (val === null || val === undefined) return undefined;
    if (typeof val === 'object') {
      const obj = val as any;
      // Check if all values are empty strings or undefined
      const hasValidValues = Object.values(obj).some(value => 
        value && typeof value === 'string' && value.trim().length > 0
      );
      if (!hasValidValues) return undefined;
    }
    return val;
  }, z.object({
    name: z.string().optional(),
    taxId: z.string().optional(),
    industry: z.string().optional(),
    contactEmail: z.string().optional().or(z.literal("")),
    contactPhone: z.string().optional(),
    website: z.string().optional(),
  }).partial().optional()),
  address: z.string().min(10, "La dirección debe tener al menos 10 caracteres"),
  city: z.string().min(2, "La ciudad debe tener al menos 2 caracteres"),
  state: z.string().min(2, "El estado debe tener al menos 2 caracteres"),
  zipCode: z.string().min(5, "El código postal debe tener al menos 5 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
}).superRefine((data, ctx) => {
  // Only validate newCompany.name if newCompany is defined and being used
  if (data.newCompany && typeof data.newCompany === 'object') {
    if (data.newCompany.name && data.newCompany.name.trim().length > 0) {
      if (data.newCompany.name.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          minimum: 2,
          type: "string",
          inclusive: true,
          message: "El nombre de la empresa debe tener al menos 2 caracteres",
          path: ["newCompany", "name"],
        });
      }
    }
  }
});

// Quote request schema
export const quoteRequestSchema = z.object({
  products: z.array(z.object({
    productId: z.number(),
    quantity: z.number().min(1),
    size: z.string(),
    color: z.string(),
    notes: z.string().optional(),
  })),
  urgency: z.enum(["normal", "urgent", "very_urgent"]),
  notes: z.string().optional(),
  preferredDeliveryDate: z.string().optional(),
});

// Local user schemas
export const insertLocalUserSchema = createInsertSchema(localUsers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLogin: true,
});

export const loginSchema = z.object({
  username: z.string().min(1, "El usuario o email es requerido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type LocalUser = typeof localUsers.$inferSelect;
export type InsertLocalUser = z.infer<typeof insertLocalUserSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;

export const adminRegistrationSchema = z.object({
  email: z.string().email("Email inválido"),
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().optional(),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string(),
  adminCode: z.string().min(1, "El código de administrador es requerido"),
  role: z.literal("admin"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export type AdminRegistrationRequest = z.infer<typeof adminRegistrationSchema>;

// Size range types
export type SizeRange = typeof sizeRanges.$inferSelect;
export type InsertSizeRange = typeof sizeRanges.$inferInsert;
export const insertSizeRangeSchema = createInsertSchema(sizeRanges);

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertBrand = z.infer<typeof insertBrandSchema>;
export type Brand = typeof brands.$inferSelect;

export type InsertSize = z.infer<typeof insertSizeSchema>;
export type Size = typeof sizes.$inferSelect;

export type InsertColor = z.infer<typeof insertColorSchema>;
export type Color = typeof colors.$inferSelect;

export type InsertGarmentType = z.infer<typeof insertGarmentTypeSchema>;
export type GarmentType = typeof garmentTypes.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertInventory = z.infer<typeof insertInventorySchema>;
export type Inventory = typeof inventory.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;

export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type Quote = typeof quotes.$inferSelect;

export type InsertPromotion = z.infer<typeof insertPromotionSchema>;
export type Promotion = typeof promotions.$inferSelect;

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

export type InsertProductColorImage = z.infer<typeof insertProductColorImageSchema>;
export type ProductColorImage = typeof productColorImages.$inferSelect;

export type CustomerRegistration = z.infer<typeof customerRegistrationSchema>;
export type QuoteRequest = z.infer<typeof quoteRequestSchema>;

export type InsertIndustrySection = z.infer<typeof insertIndustrySectionSchema>;
export type IndustrySection = typeof industrySections.$inferSelect;

export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companies.$inferSelect;

export type InsertCompanyType = z.infer<typeof insertCompanyTypeSchema>;
export type CompanyType = typeof companyTypes.$inferSelect;

export type InsertProductPricing = z.infer<typeof insertProductPricingSchema>;
export type ProductPricing = typeof productPricing.$inferSelect;

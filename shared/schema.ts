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

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default("customer"), // admin, customer
  phone: varchar("phone", { length: 20 }),
  company: varchar("company", { length: 200 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  zipCode: varchar("zip_code", { length: 10 }),
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
  gender: genderEnum("gender").default("unisex"),
  garmentTypeId: integer("garment_type_id").references(() => garmentTypes.id),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  images: text("images").array().default([]),
  sizes: text("sizes").array().default([]),
  colors: text("colors").array().default([]),
  isActive: boolean("is_active").default(true),
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
  customerId: varchar("customer_id").references(() => users.id),
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
}));

export const garmentTypesRelations = relations(garmentTypes, ({ many }) => ({
  products: many(products),
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
  phone: z.string().min(10, "El teléfono debe tener al menos 10 dígitos"),
  company: z.string().optional(),
  address: z.string().min(10, "La dirección debe tener al menos 10 caracteres"),
  city: z.string().min(2, "La ciudad debe tener al menos 2 caracteres"),
  state: z.string().min(2, "El estado debe tener al menos 2 caracteres"),
  zipCode: z.string().min(5, "El código postal debe tener al menos 5 caracteres"),
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

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

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
export type CustomerRegistration = z.infer<typeof customerRegistrationSchema>;
export type QuoteRequest = z.infer<typeof quoteRequestSchema>;

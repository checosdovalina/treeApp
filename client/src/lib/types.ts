// Types extracted from schema for frontend use
export type Product = {
  id: number;
  name: string;
  sku?: string | null;
  description?: string | null;
  categoryId?: number | null;
  brand?: string | null;
  genders: string[]; // Array de géneros: masculino, femenino, unisex
  garmentTypeId?: number | null;
  price: string;
  images: string[];
  sizes: string[];
  colors: string[];
  isActive?: boolean | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};

export type Category = {
  id: number;
  name: string;
  description?: string | null;
  createdAt?: Date | null;
};

export type Brand = {
  id: number;
  name: string;
  description?: string | null;
  createdAt?: Date | null;
};

export type Size = {
  id: number;
  name: string;
  sortOrder?: number | null;
  createdAt?: Date | null;
};

export type Color = {
  id: number;
  name: string;
  hexCode?: string | null;
  createdAt?: Date | null;
};

export type InventoryItem = {
  id: number;
  productId?: number | null;
  size?: string | null;
  color?: string | null;
  quantity: number;
  reservedQuantity: number;
  updatedAt?: Date | null;
};
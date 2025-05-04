export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  image?: string;
  category: string;
  sku: string;
  cost: number;
  supplierId?: string;
  barcode?: string; // Added for compatibility with Inventory.tsx
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface SalesData {
  date: string;
  sales: number;
  transactions: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  loyaltyPoints?: number;
}

export interface CustomerTransaction {
  id: string;
  date: Date;
  total: number;
  items: {
    product: Product;
    quantity: number;
  }[];
  paymentMethod: string;
}

// Adding ProductReference to fix supplier products array issues
export type ProductReference = string | Product;

export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  products?: ProductReference[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'master' | 'cashier'; // Added 'master' role
  status: 'active' | 'inactive';
  lastLogin?: string;
  managedShops?: string[]; // IDs of shops the master manager manages
}

// Add Shop interface for multi-tenant support
export interface Shop {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  logo?: string;
  ownerId: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  managers?: string[]; // IDs of managers for this shop
}

// Add Organization interface for SaaS model
export interface Organization {
  id: string;
  name: string;
  plan: 'free' | 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'inactive' | 'trial';
  trialEndsAt?: Date;
  createdAt: Date;
  ownerId: string;
}

// Adding ProductReference to fix supplier products array issues
export type ProductReference = string | Product;

export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  products?: ProductReference[];
}

// Add ShopContext for multi-shop support
export interface ShopContextType {
  currentShop: Shop | null;
  shops: Shop[];
  setCurrentShop: (shop: Shop) => void;
  refreshShops: () => void;
}

// Adding SimpleProduct for use in components that don't need the full Product interface
export interface SimpleProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  category?: string;
  sku?: string;
  cost?: number;
  stockQuantity?: number;
}

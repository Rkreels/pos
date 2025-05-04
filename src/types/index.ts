
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

// Define the product reference type that can be either a string ID or a Product object
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
  permissions?: UserPermissions; // Added for detailed role permissions
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

// New interface for detailed permission control
export interface UserPermissions {
  inventory: {
    view: boolean;
    edit: boolean;
    delete: boolean;
  };
  pos: {
    access: boolean;
    applyDiscounts: boolean;
    voidTransactions: boolean;
  };
  customers: {
    view: boolean;
    edit: boolean;
    delete: boolean;
  };
  reports: {
    view: boolean;
    export: boolean;
  };
  settings: {
    view: boolean;
    edit: boolean;
  };
  users: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  shops: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  suppliers: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
}

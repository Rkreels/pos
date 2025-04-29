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

export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  products?: Product[];
}

// Update the User interface to include status as a string
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'cashier';
  status: 'active' | 'inactive';
  lastLogin?: string;
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

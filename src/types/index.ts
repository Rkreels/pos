
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category?: string;
  stockQuantity?: number;
  barcode?: string;
  sku?: string;
  image?: string;
  cost?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  loyaltyPoints?: number;
}

export interface Order {
  id: string;
  customerId?: string;
  items: CartItem[];
  total: number;
  tax: number;
  subtotal: number;
  date: Date;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'refunded';
}

export interface SalesData {
  date: string;
  sales: number;
  transactions: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
}

export interface UserRole {
  id: string;
  name: 'admin' | 'manager' | 'cashier';
  permissions: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

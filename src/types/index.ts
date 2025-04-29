
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
  supplierId?: string;
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
  active?: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  products?: string[]; // Array of product IDs associated with this supplier
}

export interface CustomerTransaction {
  id: string;
  date: Date;
  total: number;
  items: CartItem[];
  paymentMethod: string;
}

export interface WeeklyReportData {
  week: string;
  days: SalesData[];
  totalSales: number;
  totalTransactions: number;
  comparisonToLastWeek: number; // percentage
}

export interface MonthlyReportData {
  month: string;
  days: SalesData[];
  totalSales: number;
  totalTransactions: number;
  comparisonToLastMonth: number; // percentage
}

export interface YearlyReportData {
  year: string;
  months: {
    month: string;
    sales: number;
    transactions: number;
  }[];
  totalSales: number;
  totalTransactions: number;
  comparisonToLastYear: number; // percentage
}

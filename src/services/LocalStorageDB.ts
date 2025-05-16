
import { Product, Customer, Supplier, Shop, User } from '@/types';
import { productData } from '@/data/products';
import { supplierData } from '@/data/suppliers';

// Define types for our collections
type CollectionName = 'products' | 'customers' | 'suppliers' | 'shops' | 'users' | 'cart';
type CollectionData = Product[] | Customer[] | Supplier[] | Shop[] | User[] | any[];

class LocalStorageDB {
  private readonly PREFIX = 'pos_system_';
  
  constructor() {
    this.initializeDb();
  }
  
  // Initialize the database with default data if it doesn't exist
  private initializeDb(): void {
    // Check if we need to initialize the database
    if (!localStorage.getItem(`${this.PREFIX}initialized`)) {
      // Initialize products
      this.saveCollection('products', productData);
      
      // Initialize suppliers
      this.saveCollection('suppliers', supplierData);
      
      // Mark as initialized
      localStorage.setItem(`${this.PREFIX}initialized`, 'true');
      
      console.log('LocalStorageDB: Database initialized with default data');
    }
  }
  
  // Get all items from a collection
  getCollection<T>(name: CollectionName): T[] {
    const data = localStorage.getItem(`${this.PREFIX}${name}`);
    return data ? JSON.parse(data) : [];
  }
  
  // Save an entire collection
  saveCollection(name: CollectionName, data: CollectionData): void {
    localStorage.setItem(`${this.PREFIX}${name}`, JSON.stringify(data));
  }
  
  // Get a single item by ID
  getItem<T>(collection: CollectionName, id: string): T | null {
    const items = this.getCollection<T>(collection);
    return (items as any[]).find(item => item.id === id) || null;
  }
  
  // Add an item to a collection
  addItem<T extends { id: string }>(collection: CollectionName, item: T): T {
    const items = this.getCollection<T>(collection);
    const newItems = [...items, item];
    this.saveCollection(collection, newItems);
    return item;
  }
  
  // Update an item in a collection
  updateItem<T extends { id: string }>(collection: CollectionName, item: T): T | null {
    const items = this.getCollection<T>(collection);
    const index = (items as T[]).findIndex(i => i.id === item.id);
    
    if (index === -1) return null;
    
    const newItems = [...items];
    newItems[index] = item;
    this.saveCollection(collection, newItems);
    return item;
  }
  
  // Delete an item from a collection
  deleteItem(collection: CollectionName, id: string): boolean {
    const items = this.getCollection(collection);
    const filteredItems = items.filter((item: any) => item.id !== id);
    
    if (filteredItems.length === items.length) {
      return false; // Item not found
    }
    
    this.saveCollection(collection, filteredItems);
    return true;
  }
  
  // Clear a collection
  clearCollection(collection: CollectionName): void {
    this.saveCollection(collection, []);
  }
  
  // Save cart items
  saveCart(cartItems: any[]): void {
    this.saveCollection('cart', cartItems);
  }
  
  // Get cart items
  getCart(): any[] {
    return this.getCollection('cart');
  }
  
  // Clear the database (for testing)
  clearDb(): void {
    localStorage.removeItem(`${this.PREFIX}initialized`);
    localStorage.removeItem(`${this.PREFIX}products`);
    localStorage.removeItem(`${this.PREFIX}customers`);
    localStorage.removeItem(`${this.PREFIX}suppliers`);
    localStorage.removeItem(`${this.PREFIX}shops`);
    localStorage.removeItem(`${this.PREFIX}users`);
    localStorage.removeItem(`${this.PREFIX}cart`);
  }
}

export const db = new LocalStorageDB();

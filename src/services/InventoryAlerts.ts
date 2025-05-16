
import { Product } from '@/types';
import { toast } from 'sonner';

export class InventoryAlerts {
  // Thresholds for inventory alerts
  private static readonly LOW_STOCK_THRESHOLD = 5;
  private static readonly CRITICAL_STOCK_THRESHOLD = 2;
  
  // Check stock level and trigger alerts if necessary
  static checkStockLevel(product: Product): void {
    if (product.stockQuantity <= 0) {
      this.triggerOutOfStockAlert(product);
    } else if (product.stockQuantity <= this.CRITICAL_STOCK_THRESHOLD) {
      this.triggerCriticalStockAlert(product);
    } else if (product.stockQuantity <= this.LOW_STOCK_THRESHOLD) {
      this.triggerLowStockAlert(product);
    }
  }
  
  // Check all products and identify low stock items
  static checkInventory(products: Product[]): Product[] {
    const lowStockProducts: Product[] = [];
    
    products.forEach(product => {
      if (product.stockQuantity <= this.LOW_STOCK_THRESHOLD) {
        lowStockProducts.push(product);
      }
    });
    
    return lowStockProducts;
  }
  
  // Display a toast alert for out of stock products
  private static triggerOutOfStockAlert(product: Product): void {
    toast.error(`${product.name} is OUT OF STOCK!`, {
      id: `outofstock-${product.id}`,
      duration: 5000
    });
  }
  
  // Display a toast alert for critically low stock
  private static triggerCriticalStockAlert(product: Product): void {
    toast.warning(`${product.name} has CRITICALLY LOW stock: ${product.stockQuantity} remaining!`, {
      id: `criticalstock-${product.id}`,
      duration: 4000
    });
  }
  
  // Display a toast alert for low stock
  private static triggerLowStockAlert(product: Product): void {
    toast.info(`${product.name} is running low: ${product.stockQuantity} remaining.`, {
      id: `lowstock-${product.id}`,
      duration: 3000
    });
  }
  
  // Get alert status for a product (for UI display)
  static getAlertStatus(product: Product): 'out-of-stock' | 'critical' | 'low' | null {
    if (product.stockQuantity <= 0) {
      return 'out-of-stock';
    } else if (product.stockQuantity <= this.CRITICAL_STOCK_THRESHOLD) {
      return 'critical';
    } else if (product.stockQuantity <= this.LOW_STOCK_THRESHOLD) {
      return 'low';
    }
    return null;
  }
}

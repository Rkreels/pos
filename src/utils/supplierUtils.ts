
import { Supplier, Product, ProductReference } from '@/types';

export const attachProductsToSuppliers = (
  suppliers: Supplier[], 
  products: Product[]
): Supplier[] => {
  return suppliers.map(supplier => {
    // Find all products that have this supplier ID
    const supplierProducts = products.filter(product => product.supplierId === supplier.id);
    
    // Create references using product IDs
    const productReferences: ProductReference[] = supplierProducts.map(product => ({
      id: product.id,
      name: product.name
    }));
    
    // Return supplier with products attached
    return {
      ...supplier,
      products: productReferences
    };
  });
};

export const getSupplierProductIds = (supplier: Supplier): string[] => {
  if (!supplier.products) return [];
  return supplier.products.map(product => product.id);
};

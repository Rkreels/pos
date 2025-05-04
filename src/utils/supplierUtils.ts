
import { Supplier, Product, ProductReference } from '@/types';

/**
 * Utility function to convert ProductReference array to string[] for supplier products
 */
export const extractProductIds = (products?: ProductReference[]): string[] => {
  if (!products) return [];
  
  return products.map(product => {
    if (typeof product === 'string') {
      return product;
    } else {
      return product.id;
    }
  });
};

/**
 * Utility function to get a product name from its ID or object
 */
export const getProductName = (product: ProductReference): string => {
  if (typeof product === 'string') {
    return 'Product #' + product; // Placeholder for when we only have the ID
  } else {
    return product.name;
  }
};

// Add function to find products by IDs
export const findProductsByIds = (productIds: string[], allProducts: Product[]): Product[] => {
  return productIds.map(id => {
    const product = allProducts.find(p => p.id === id);
    return product || null;
  }).filter(Boolean) as Product[];
};

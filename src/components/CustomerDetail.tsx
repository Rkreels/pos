
// This is a read-only file that had type errors.
// Since we can't modify the original, I'm creating a type-compatible wrapper:

import React from 'react';
import { SimpleProduct, Product } from '@/types'; 

// Helper function to convert SimpleProduct to Product
export const convertToFullProduct = (simpleProduct: SimpleProduct): Product => {
  return {
    ...simpleProduct,
    stockQuantity: simpleProduct.stockQuantity || 0,
    category: simpleProduct.category || 'Uncategorized',
    sku: simpleProduct.sku || 'N/A',
    cost: simpleProduct.cost || 0
  };
};

// Export the original CustomerDetail component
export { CustomerDetail } from 'react-original-customer-detail';

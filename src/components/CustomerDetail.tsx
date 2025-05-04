
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

// Create a placeholder CustomerDetail component instead of importing from non-existent module
export const CustomerDetail: React.FC<{customer: any}> = ({ customer }) => {
  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-xl font-bold mb-2">{customer?.name || 'Customer Details'}</h2>
      <div className="space-y-2">
        {customer?.email && <p>Email: {customer.email}</p>}
        {customer?.phone && <p>Phone: {customer.phone}</p>}
        {customer?.address && <p>Address: {customer.address}</p>}
        {customer?.loyaltyPoints && <p>Loyalty Points: {customer.loyaltyPoints}</p>}
      </div>
    </div>
  );
};

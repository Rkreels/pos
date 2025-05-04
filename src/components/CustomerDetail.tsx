
import React from 'react';
import { SimpleProduct, Product, Customer } from '@/types'; 
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';

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

// Updated CustomerDetail component with proper props
export interface CustomerDetailProps {
  customer: Customer;
  onBack?: () => void;
  onEdit?: (customer: Customer) => void;
}

export const CustomerDetail: React.FC<CustomerDetailProps> = ({ customer, onBack, onEdit }) => {
  return (
    <div className="p-4 border rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{customer?.name || 'Customer Details'}</h2>
        <div className="flex gap-2">
          {onBack && (
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          )}
          {onEdit && (
            <Button size="sm" onClick={() => onEdit(customer)}>
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
          )}
        </div>
      </div>
      <div className="space-y-2">
        {customer?.email && <p>Email: {customer.email}</p>}
        {customer?.phone && <p>Phone: {customer.phone}</p>}
        {customer?.address && <p>Address: {customer.address}</p>}
        {customer?.loyaltyPoints && <p>Loyalty Points: {customer.loyaltyPoints}</p>}
      </div>
    </div>
  );
};

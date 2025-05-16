
import React from 'react';
import { Product } from '@/types';
import { Minus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProductExchange {
  productId: string;
  quantity: number;
}

interface ExchangeProductItemProps {
  item: ProductExchange;
  index: number;
  products: Product[];
  isRequestMode: boolean;
  onRemove: (index: number) => void;
  onProductChange: (index: number, productId: string) => void;
  onQuantityChange: (index: number, quantity: number) => void;
}

export const ExchangeProductItem: React.FC<ExchangeProductItemProps> = ({
  item,
  index,
  products,
  isRequestMode,
  onRemove,
  onProductChange,
  onQuantityChange
}) => {
  // Ensure product id is never an empty string
  const productId = item.productId || "select-product";

  return (
    <div className="flex items-center gap-2 p-2 border rounded-md">
      <div className="flex-1">
        <div className="flex gap-2">
          <Select
            value={productId}
            onValueChange={(value) => onProductChange(index, value === "select-product" ? "" : value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select product" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="placeholder" value="select-product">
                Select a product
              </SelectItem>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id || `product-${index}-${product.name}`}>
                  {product.name} {!isRequestMode && `(${product.stockQuantity} in stock)`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex items-center gap-1">
            <Label htmlFor={`quantity-${index}`} className="sr-only">Quantity</Label>
            <Input
              id={`quantity-${index}`}
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => onQuantityChange(index, parseInt(e.target.value) || 1)}
              className="w-20"
            />
          </div>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onRemove(index)}
      >
        <Minus className="h-4 w-4" />
      </Button>
    </div>
  );
};

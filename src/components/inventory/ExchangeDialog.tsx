
import React from 'react';
import { Product, Shop } from '@/types';
import { Plus } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ExchangeProductItem } from './ExchangeProductItem';

interface ProductExchange {
  productId: string;
  quantity: number;
}

interface ExchangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isRequestMode: boolean;
  otherShops: Shop[];
  products: Product[];
  onExchange: (targetShop: string, products: ProductExchange[], isRequest: boolean) => void;
}

export const ExchangeDialog: React.FC<ExchangeDialogProps> = ({
  isOpen,
  onClose,
  isRequestMode,
  otherShops,
  products,
  onExchange
}) => {
  const [targetShop, setTargetShop] = React.useState<string>('');
  const [selectedProducts, setSelectedProducts] = React.useState<ProductExchange[]>([]);
  
  // Filter products with stock for sending
  const productsWithStock = products.filter(product => 
    isRequestMode || product.stockQuantity > 0
  );
  
  const handleAddProduct = () => {
    setSelectedProducts([...selectedProducts, { productId: '', quantity: 1 }]);
  };
  
  const handleRemoveProduct = (index: number) => {
    const newSelectedProducts = [...selectedProducts];
    newSelectedProducts.splice(index, 1);
    setSelectedProducts(newSelectedProducts);
  };
  
  const updateProductSelection = (index: number, productId: string) => {
    const newSelectedProducts = [...selectedProducts];
    newSelectedProducts[index].productId = productId;
    setSelectedProducts(newSelectedProducts);
  };
  
  const updateProductQuantity = (index: number, quantity: number) => {
    const newSelectedProducts = [...selectedProducts];
    newSelectedProducts[index].quantity = quantity;
    setSelectedProducts(newSelectedProducts);
  };
  
  const handleExchange = () => {
    if (!targetShop || selectedProducts.length === 0) {
      toast.error("Please select a shop and at least one product");
      return;
    }
    
    if (selectedProducts.some(item => !item.productId || item.quantity <= 0)) {
      toast.error("Please complete all product selections with valid quantities");
      return;
    }
    
    if (!isRequestMode) {
      // Check if we have enough stock
      const insufficientStock = selectedProducts.some(item => {
        const product = products.find(p => p.id === item.productId);
        return !product || product.stockQuantity < item.quantity;
      });
      
      if (insufficientStock) {
        toast.error("Not enough stock for one or more selected products");
        return;
      }
    }
    
    onExchange(targetShop, selectedProducts, isRequestMode);
  };
  
  // Reset state when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      setSelectedProducts([]);
      setTargetShop('');
    }
  }, [isOpen]);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isRequestMode ? 'Request Inventory' : 'Send Inventory'}
          </DialogTitle>
          <DialogDescription>
            {isRequestMode 
              ? 'Request products from another shop in your network' 
              : 'Send products to another shop in your network'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="shop" className="text-right">
              {isRequestMode ? 'From Shop' : 'To Shop'}
            </Label>
            <Select
              value={targetShop || "select-shop"}
              onValueChange={(value) => setTargetShop(value === "select-shop" ? "" : value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select shop" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="placeholder" value="select-shop">
                  Select a shop
                </SelectItem>
                {otherShops.map((shop) => (
                  <SelectItem key={shop.id} value={shop.id || `shop-${shop.name.replace(/\s+/g, '-').toLowerCase()}`}>
                    {shop.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedProducts.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500 mb-2">No products selected yet</p>
              <Button onClick={handleAddProduct} size="sm">
                <Plus className="h-4 w-4 mr-1" /> Add Product
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedProducts.map((item, index) => (
                <ExchangeProductItem 
                  key={index}
                  item={item}
                  index={index}
                  products={productsWithStock}
                  isRequestMode={isRequestMode}
                  onRemove={handleRemoveProduct}
                  onProductChange={updateProductSelection}
                  onQuantityChange={updateProductQuantity}
                />
              ))}
              
              <Button onClick={handleAddProduct} variant="outline" size="sm" className="mt-2">
                <Plus className="h-4 w-4 mr-1" /> Add Another Product
              </Button>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleExchange}
            disabled={!targetShop || selectedProducts.length === 0 || selectedProducts.some(item => !item.productId)}
          >
            {isRequestMode ? 'Send Request' : 'Send Inventory'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

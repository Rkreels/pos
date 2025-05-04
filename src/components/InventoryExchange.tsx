
import React, { useState } from 'react';
import { Product, Shop } from '@/types';
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
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useShop } from '@/context/ShopContext';
import { toast } from 'sonner';
import { ArrowRight, PackageCheck, Plus, Minus } from 'lucide-react';
import { voiceAssistant } from '@/services/VoiceAssistant';

interface InventoryExchangeProps {
  products: Product[];
  setProducts: (products: Product[]) => void;
}

interface ProductExchange {
  productId: string;
  quantity: number;
}

export const InventoryExchange: React.FC<InventoryExchangeProps> = ({ products, setProducts }) => {
  const { shops, currentShop } = useShop();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [targetShop, setTargetShop] = useState<string>('');
  const [isRequestMode, setIsRequestMode] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<ProductExchange[]>([]);
  
  // Filter out current shop from the list
  const otherShops = shops.filter(shop => shop.id !== currentShop?.id);
  
  const handleInitiateExchange = (isRequest: boolean) => {
    setSelectedProducts([]);
    setTargetShop('');
    setIsRequestMode(isRequest);
    setIsDialogOpen(true);
    voiceAssistant.speakInventoryExchange();
  };
  
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
      
      // Update current shop's inventory
      const updatedProducts = products.map(p => {
        const exchangeItem = selectedProducts.find(item => item.productId === p.id);
        if (exchangeItem) {
          return { ...p, stockQuantity: p.stockQuantity - exchangeItem.quantity };
        }
        return p;
      });
      
      setProducts(updatedProducts);
      
      const targetShopName = shops.find(s => s.id === targetShop)?.name || "another shop";
      const productCount = selectedProducts.length;
      toast.success(`Sent ${productCount} product${productCount > 1 ? 's' : ''} to ${targetShopName}`);
    } else {
      // Requesting inventory
      const sourceShopName = shops.find(s => s.id === targetShop)?.name || "another shop";
      const productCount = selectedProducts.length;
      toast.success(`Requested ${productCount} product${productCount > 1 ? 's' : ''} from ${sourceShopName}`);
    }
    
    setIsDialogOpen(false);
  };
  
  // Get product names for display
  const getProductName = (productId: string): string => {
    const product = products.find(p => p.id === productId);
    return product ? `${product.name} (${product.stockQuantity} in stock)` : '';
  };
  
  // Filter products with stock for sending
  const productsWithStock = products.filter(product => 
    isRequestMode || product.stockQuantity > 0
  );
  
  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <PackageCheck className="mr-2" /> Inventory Exchange
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-md p-4">
            <h3 className="text-lg font-semibold mb-3">Request Inventory</h3>
            <p className="text-sm text-gray-500 mb-4">
              Request products from other shops in your network.
            </p>
            <Button 
              onClick={() => {
                if (!currentShop) {
                  toast.error("Please select a shop first");
                  return;
                }
                if (otherShops.length === 0) {
                  toast.error("No other shops available for inventory exchange");
                  return;
                }
                handleInitiateExchange(true);
              }}
              className="w-full"
            >
              Request Products
            </Button>
          </div>
          
          <div className="border rounded-md p-4">
            <h3 className="text-lg font-semibold mb-3">Send Inventory</h3>
            <p className="text-sm text-gray-500 mb-4">
              Send products from your inventory to other shops.
            </p>
            <Button 
              onClick={() => {
                if (!currentShop) {
                  toast.error("Please select a shop first");
                  return;
                }
                if (otherShops.length === 0) {
                  toast.error("No other shops available for inventory exchange");
                  return;
                }
                if (productsWithStock.length === 0) {
                  toast.error("No products with available stock to send");
                  return;
                }
                handleInitiateExchange(false);
              }}
              variant="outline"
              className="w-full"
            >
              Send Products
            </Button>
          </div>
        </div>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                value={targetShop}
                onValueChange={setTargetShop}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select shop" />
                </SelectTrigger>
                <SelectContent>
                  {otherShops.map((shop) => (
                    <SelectItem key={shop.id} value={shop.id}>
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
                  <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                    <div className="flex-1">
                      <div className="flex gap-2">
                        <Select
                          value={item.productId}
                          onValueChange={(value) => updateProductSelection(index, value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            {productsWithStock.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
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
                            onChange={(e) => updateProductQuantity(index, parseInt(e.target.value) || 1)}
                            className="w-20"
                          />
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemoveProduct(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <Button onClick={handleAddProduct} variant="outline" size="sm" className="mt-2">
                  <Plus className="h-4 w-4 mr-1" /> Add Another Product
                </Button>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
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
    </>
  );
};

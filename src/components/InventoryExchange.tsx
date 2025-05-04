
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
import { useShop } from '@/context/ShopContext';
import { toast } from 'sonner';
import { ArrowRight, PackageCheck } from 'lucide-react';

interface InventoryExchangeProps {
  products: Product[];
  setProducts: (products: Product[]) => void;
}

export const InventoryExchange: React.FC<InventoryExchangeProps> = ({ products, setProducts }) => {
  const { shops, currentShop } = useShop();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [targetShop, setTargetShop] = useState<string>('');
  const [exchangeQuantity, setExchangeQuantity] = useState(1);
  const [isRequestMode, setIsRequestMode] = useState(false);
  
  // Filter out products with stock for sending
  const productsWithStock = products.filter(product => product.stockQuantity > 0);
  
  // Filter out current shop from the list
  const otherShops = shops.filter(shop => shop.id !== currentShop?.id);
  
  const handleInitiateExchange = (product: Product, isRequest: boolean) => {
    setSelectedProduct(product);
    setExchangeQuantity(1);
    setTargetShop('');
    setIsRequestMode(isRequest);
    setIsDialogOpen(true);
  };
  
  const handleExchange = () => {
    if (!selectedProduct || !targetShop || exchangeQuantity <= 0) {
      toast.error("Please select all required fields");
      return;
    }
    
    if (!isRequestMode) {
      // Sending inventory
      if (selectedProduct.stockQuantity < exchangeQuantity) {
        toast.error("Not enough stock to send");
        return;
      }
      
      // Update current shop's inventory
      const updatedProducts = products.map(p => 
        p.id === selectedProduct.id
          ? { ...p, stockQuantity: p.stockQuantity - exchangeQuantity }
          : p
      );
      
      setProducts(updatedProducts);
      
      const targetShopName = shops.find(s => s.id === targetShop)?.name || "another shop";
      toast.success(`Sent ${exchangeQuantity} ${selectedProduct.name} to ${targetShopName}`);
    } else {
      // Requesting inventory (in a real app, this would send a notification to the other shop)
      const sourceShopName = shops.find(s => s.id === targetShop)?.name || "another shop";
      toast.success(`Requested ${exchangeQuantity} ${selectedProduct.name} from ${sourceShopName}`);
    }
    
    setIsDialogOpen(false);
  };
  
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
                setIsRequestMode(true);
                setIsDialogOpen(true);
                setSelectedProduct(null);
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
                setIsRequestMode(false);
                setIsDialogOpen(true);
                setSelectedProduct(null);
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
        <DialogContent className="sm:max-w-[500px]">
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
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="product" className="text-right">Product</Label>
              <Select
                value={selectedProduct?.id || ''}
                onValueChange={(value) => {
                  const product = products.find(p => p.id === value);
                  setSelectedProduct(product || null);
                }}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {(isRequestMode ? products : productsWithStock).map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} {!isRequestMode && `(${product.stockQuantity} in stock)`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={exchangeQuantity}
                onChange={(e) => setExchangeQuantity(parseInt(e.target.value) || 1)}
                className="col-span-3"
              />
            </div>
            
            {!isRequestMode && selectedProduct && (
              <div className="text-sm text-gray-500 col-span-4 text-right">
                Current stock: {selectedProduct.stockQuantity}
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
              disabled={!selectedProduct || !targetShop || exchangeQuantity <= 0}
            >
              {isRequestMode ? 'Send Request' : 'Send Inventory'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

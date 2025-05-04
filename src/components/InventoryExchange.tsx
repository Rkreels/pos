
import React, { useState } from 'react';
import { Product, Shop } from '@/types';
import { Button } from '@/components/ui/button';
import { useShop } from '@/context/ShopContext';
import { toast } from 'sonner';
import { ArrowRight, PackageCheck } from 'lucide-react';
import { voiceAssistant } from '@/services/VoiceAssistant';
import { ExchangeDialog } from './inventory/ExchangeDialog';

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
  const [isRequestMode, setIsRequestMode] = useState(false);
  
  // Filter out current shop from the list
  const otherShops = shops.filter(shop => shop.id !== currentShop?.id);
  
  const handleInitiateExchange = (isRequest: boolean) => {
    setIsRequestMode(isRequest);
    setIsDialogOpen(true);
    voiceAssistant.speakInventoryExchange();
  };
  
  const handleExchange = (targetShop: string, selectedProducts: ProductExchange[], isRequest: boolean) => {
    if (!isRequest) {
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
                const productsWithStock = products.filter(p => p.stockQuantity > 0);
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
      
      <ExchangeDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        isRequestMode={isRequestMode}
        otherShops={otherShops}
        products={products}
        onExchange={handleExchange}
      />
    </>
  );
};

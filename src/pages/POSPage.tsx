
import React, { useState, useEffect } from 'react';
import { MainNavigation } from '@/components/MainNavigation';
import { POSView } from '@/components/POSView';
import { productData } from '@/data/products';
import { Product } from '@/types';
import { voiceAssistant } from '@/services/VoiceAssistant';
import { useShop } from '@/context/ShopContext';
import { Card, CardContent } from '@/components/ui/card';
import { Store } from 'lucide-react';

const POSPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(productData);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const { currentShop } = useShop();

  useEffect(() => {
    // Speak page overview when the page loads
    const timer = setTimeout(() => {
      voiceAssistant.speakPOSPage();
    }, 500);
    
    return () => {
      clearTimeout(timer);
      voiceAssistant.stopSpeaking();
    };
  }, []);

  // When shop changes, reload products (in a real app, this would fetch from an API)
  useEffect(() => {
    if (currentShop) {
      // In a real app, we'd filter products by shop ID
      // For now, we'll just use the same sample data
      setProducts(productData);
      
      // Announce shop change
      voiceAssistant.speakShopSwitched(currentShop.name);
    }
  }, [currentShop?.id]);

  return (
    <div className="flex h-screen bg-gray-50">
      <MainNavigation isCollapsed={sidebarCollapsed} toggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm py-4 px-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Point of Sale</h1>
            {currentShop && (
              <Card className="border-0 shadow-none bg-transparent">
                <CardContent className="p-0 flex items-center">
                  <Store className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">
                    Current Shop: {currentShop.name}
                  </span>
                </CardContent>
              </Card>
            )}
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          {!currentShop ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Store className="h-16 w-16 text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-700 mb-2">No Shop Selected</h2>
              <p className="text-gray-500 mb-4">Please select a shop from the sidebar to access the Point of Sale system.</p>
            </div>
          ) : (
            <POSView products={products} setProducts={setProducts} />
          )}
        </main>
      </div>
    </div>
  );
};

export default POSPage;

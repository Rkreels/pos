
import React, { useState, useEffect } from 'react';
import { Product, SalesData } from '@/types';
import { voiceAssistant } from '@/services/VoiceAssistant';
import { MainNavigation } from '@/components/MainNavigation';
import { productData } from '@/data/products';
import { useShop } from '@/context/ShopContext';
import { Card, CardContent } from '@/components/ui/card';
import { Store } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { DashboardSelector } from '@/components/DashboardSelector';

const sampleSalesData: SalesData[] = [
  { date: 'Jan 1', sales: 4000, transactions: 24 },
  { date: 'Jan 2', sales: 3000, transactions: 18 },
  { date: 'Jan 3', sales: 2000, transactions: 12 },
  { date: 'Jan 4', sales: 2780, transactions: 16 },
  { date: 'Jan 5', sales: 1890, transactions: 11 },
  { date: 'Jan 6', sales: 2390, transactions: 14 },
  { date: 'Jan 7', sales: 3490, transactions: 21 },
];

const sampleTopSellingProducts = [
  { id: '1', name: 'Premium Coffee', sold: 42 },
  { id: '2', name: 'Wireless Earbuds', sold: 38 },
  { id: '7', name: 'Bluetooth Speaker', sold: 27 },
  { id: '5', name: 'Portable Charger', sold: 23 },
];

const sampleRecentActivity = [
  { id: '1', action: 'New order #12345 processed', time: '10 mins ago' },
  { id: '2', action: 'Inventory updated for Premium Coffee', time: '25 mins ago' },
  { id: '3', action: 'Customer John D. registered', time: '1 hour ago' },
  { id: '4', action: 'Daily sales report generated', time: '2 hours ago' },
];

const Index = () => {
  const [products, setProducts] = useState<Product[]>(productData);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { currentShop } = useShop();
  const { currentUser } = useAuth();
  
  useEffect(() => {
    // Clear any previous speech and start new explanation after a slight delay
    voiceAssistant.stopSpeaking();
    
    // Speak page overview when the page loads
    const timer = setTimeout(() => {
      voiceAssistant.speakDashboardOverview(currentUser.role);
    }, 800);
    
    return () => {
      clearTimeout(timer);
      voiceAssistant.stopSpeaking();
    };
  }, [currentUser.role]);

  useEffect(() => {
    // When shop changes, announce it
    if (currentShop) {
      voiceAssistant.speak(`You are now viewing data for ${currentShop.name}. All dashboard information has been updated accordingly.`);
    }
  }, [currentShop?.id]);

  return (
    <div className="flex h-screen bg-gray-50">
      <MainNavigation isCollapsed={sidebarCollapsed} toggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm py-4 px-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              {currentUser.role === 'master' ? 'Master Manager Dashboard' : 'Dashboard'}
            </h1>
            {currentShop && currentUser.role !== 'master' && (
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
          <DashboardSelector
            currentUser={currentUser}
            currentShop={currentShop}
            products={products}
            sampleSalesData={sampleSalesData}
            sampleTopSellingProducts={sampleTopSellingProducts}
            sampleRecentActivity={sampleRecentActivity}
          />
        </main>
      </div>
    </div>
  );
};

export default Index;

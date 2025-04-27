
import React, { useState, useEffect } from 'react';
import { Product, SalesData } from '@/types';
import { voiceAssistant } from '@/services/VoiceAssistant';
import { MainNavigation } from '@/components/MainNavigation';
import { Dashboard } from '@/components/Dashboard';
import { Button } from '@/components/ui/button';
import { ShoppingCart, LayoutDashboard } from 'lucide-react';
import { POSView } from '@/components/POSView';
import { productData } from '@/data/products';

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
  const [activeView, setActiveView] = useState<'dashboard' | 'pos'>('dashboard');
  const [products, setProducts] = useState<Product[]>(productData);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(activeView === 'pos');
  
  useEffect(() => {
    // Auto-collapse sidebar when viewing POS
    if (activeView === 'pos') {
      setSidebarCollapsed(true);
    }
  }, [activeView]);

  useEffect(() => {
    // Speak page overview when the page loads
    const timer = setTimeout(() => {
      voiceAssistant.speakPageOverview();
    }, 500);
    
    return () => {
      clearTimeout(timer);
      voiceAssistant.stopSpeaking();
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <MainNavigation isCollapsed={sidebarCollapsed} toggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm py-4 px-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {activeView === 'dashboard' ? 'Dashboard' : 'Point of Sale'}
              </h1>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={activeView === 'dashboard' ? 'default' : 'outline'}
                onClick={() => setActiveView('dashboard')}
              >
                <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
              </Button>
              <Button 
                variant={activeView === 'pos' ? 'default' : 'outline'}
                onClick={() => setActiveView('pos')}
              >
                <ShoppingCart className="h-4 w-4 mr-2" /> POS
              </Button>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          {activeView === 'dashboard' ? (
            <Dashboard 
              totalSales={12458.99}
              totalOrders={142}
              totalCustomers={64}
              totalProducts={products.length}
              salesData={sampleSalesData}
              topSellingProducts={sampleTopSellingProducts}
              recentActivity={sampleRecentActivity}
            />
          ) : (
            <POSView products={products} setProducts={setProducts} />
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;

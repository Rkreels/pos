
import React, { useState, useEffect } from 'react';
import { MainNavigation } from '@/components/MainNavigation';
import { POSView } from '@/components/POSView';
import { productData } from '@/data/products';
import { Product } from '@/types';
import { voiceAssistant } from '@/services/VoiceAssistant';

const POSPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(productData);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

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

  return (
    <div className="flex h-screen bg-gray-50">
      <MainNavigation isCollapsed={sidebarCollapsed} toggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm py-4 px-6">
          <h1 className="text-2xl font-bold text-gray-800">Point of Sale</h1>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          <POSView products={products} setProducts={setProducts} />
        </main>
      </div>
    </div>
  );
};

export default POSPage;

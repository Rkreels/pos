
import React from 'react';
import { MainNavigation } from '@/components/MainNavigation';
import { InventoryHeader } from '@/components/inventory/InventoryHeader';

interface InventoryPageLayoutProps {
  children: React.ReactNode;
  currentShop: any;
}

export const InventoryPageLayout: React.FC<InventoryPageLayoutProps> = ({ children, currentShop }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <MainNavigation />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <InventoryHeader currentShop={currentShop} />
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

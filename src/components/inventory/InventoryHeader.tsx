
import React from 'react';
import { Shop } from '@/types';

interface InventoryHeaderProps {
  currentShop: Shop | null;
}

export const InventoryHeader: React.FC<InventoryHeaderProps> = ({ currentShop }) => {
  return (
    <header className="bg-white shadow-sm py-4 px-6">
      <h1 className="text-2xl font-bold text-gray-800">
        Inventory Management
        {currentShop && <span className="text-base font-normal ml-2">({currentShop.name})</span>}
      </h1>
    </header>
  );
};

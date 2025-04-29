
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Shop } from '@/types';

// Sample shop data for demo
const sampleShops: Shop[] = [
  {
    id: '1',
    name: 'Main Store',
    address: '123 Main St, Anytown, CA',
    phone: '555-123-4567',
    email: 'main@example.com',
    ownerId: '1',
    status: 'active',
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Downtown Branch',
    address: '456 Market St, Anytown, CA',
    phone: '555-987-6543',
    email: 'downtown@example.com',
    ownerId: '1',
    status: 'active',
    createdAt: new Date('2024-02-20')
  },
  {
    id: '3',
    name: 'Mall Kiosk',
    address: 'Anytown Mall, Anytown, CA',
    phone: '555-567-8901',
    ownerId: '1',
    status: 'active',
    createdAt: new Date('2024-03-10')
  }
];

interface ShopContextProps {
  children: ReactNode;
}

const ShopContext = createContext<{
  currentShop: Shop | null;
  shops: Shop[];
  setCurrentShop: (shop: Shop) => void;
  refreshShops: () => void;
}>({
  currentShop: null,
  shops: [],
  setCurrentShop: () => {},
  refreshShops: () => {}
});

export const useShop = () => useContext(ShopContext);

export const ShopProvider: React.FC<ShopContextProps> = ({ children }) => {
  const [shops, setShops] = useState<Shop[]>(sampleShops);
  const [currentShop, setCurrentShop] = useState<Shop | null>(null);

  useEffect(() => {
    // Set the first shop as default when the component mounts
    if (shops.length > 0 && !currentShop) {
      setCurrentShop(shops[0]);
    }
  }, [shops, currentShop]);

  const refreshShops = () => {
    // In a real application, this would fetch the latest shops from an API
    console.log('Refreshing shops...');
    // For now, we're just using the sample data
    setShops([...sampleShops]);
  };

  return (
    <ShopContext.Provider 
      value={{ 
        currentShop, 
        shops, 
        setCurrentShop, 
        refreshShops 
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

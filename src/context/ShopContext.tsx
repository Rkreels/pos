
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Shop, User } from '@/types';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

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

export interface ShopContextType {
  currentShop: Shop | null;
  shops: Shop[];
  setCurrentShop: (shop: Shop) => void;
  refreshShops: () => void;
}

const ShopContext = createContext<ShopContextType>({
  currentShop: null,
  shops: [],
  setCurrentShop: () => {},
  refreshShops: () => {}
});

export const useShop = () => useContext(ShopContext);

export const ShopProvider: React.FC<ShopContextProps> = ({ children }) => {
  const [shops, setShops] = useState<Shop[]>(sampleShops);
  const [currentShop, setCurrentShop] = useState<Shop | null>(null);
  const { currentUser } = useAuth();

  // Filter shops based on user role
  const filteredShops = React.useMemo(() => {
    if (currentUser.role === 'admin') {
      // Admin can see all shops
      return shops;
    } else if (currentUser.role === 'master' && currentUser.managedShops) {
      // Master manager can only see their assigned shops
      return shops.filter(shop => 
        currentUser.managedShops?.includes(shop.id)
      );
    } else if (currentUser.role === 'manager' && currentUser.managedShops) {
      // Regular manager typically manages one shop
      return shops.filter(shop => 
        currentUser.managedShops?.includes(shop.id)
      );
    } else {
      // Cashiers typically only see one shop, which would be their assigned shop
      // For demo purposes, we'll just return the first shop if they don't have specific assignments
      return shops.filter(shop => 
        currentUser.managedShops?.includes(shop.id) || (currentUser.role === 'cashier' && shops.length > 0)
      );
    }
  }, [shops, currentUser]);

  useEffect(() => {
    // Set the first accessible shop as default when the component mounts or user changes
    if (filteredShops.length > 0 && !currentShop) {
      setCurrentShop(filteredShops[0]);
    } else if (filteredShops.length > 0 && currentShop) {
      // If the current shop is not in the filtered list (e.g. after user role change)
      const shopExists = filteredShops.some(shop => shop.id === currentShop.id);
      if (!shopExists) {
        setCurrentShop(filteredShops[0]);
      }
    } else {
      // If no shops are accessible
      setCurrentShop(null);
    }
  }, [filteredShops, currentUser, currentShop]);

  const handleSetCurrentShop = (shop: Shop) => {
    // Check if user has access to this shop
    const hasAccess = filteredShops.some(s => s.id === shop.id);
    
    if (!hasAccess) {
      toast.error("You don't have access to this shop");
      return;
    }
    
    setCurrentShop(shop);
    toast.success(`Switched to ${shop.name}`);
  };

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
        shops: filteredShops, 
        setCurrentShop: handleSetCurrentShop, 
        refreshShops 
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

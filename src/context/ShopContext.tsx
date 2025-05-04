
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Shop, User } from '@/types';
import { toast } from 'sonner';

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

// Sample current user - In a real app, this would come from an auth context
const mockCurrentUser: User = {
  id: '5',
  name: 'Mark Master',
  email: 'mark@example.com',
  role: 'master',
  status: 'active',
  managedShops: ['1', '2', '3']
};

interface ShopContextProps {
  children: ReactNode;
  currentUser?: User; // Optional prop to override the mock user
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

export const ShopProvider: React.FC<ShopContextProps> = ({ children, currentUser = mockCurrentUser }) => {
  const [shops, setShops] = useState<Shop[]>(sampleShops);
  const [currentShop, setCurrentShop] = useState<Shop | null>(null);

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
      // Cashiers typically only see one shop
      // In a real app, you would fetch the shop they're assigned to
      return shops;
    }
  }, [shops, currentUser]);

  useEffect(() => {
    // Set the first accessible shop as default when the component mounts
    if (filteredShops.length > 0 && !currentShop) {
      setCurrentShop(filteredShops[0]);
    }
  }, [filteredShops, currentShop]);

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

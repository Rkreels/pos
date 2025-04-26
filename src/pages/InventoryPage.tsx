
import React, { useState } from 'react';
import { MainNavigation } from '@/components/MainNavigation';
import { Inventory } from '@/components/Inventory';
import { Product } from '@/types';
import { toast } from 'sonner';
import { voiceAssistant } from '@/services/VoiceAssistant';

// Sample products data
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Coffee',
    price: 19.99,
    description: 'Freshly roasted arabica coffee beans',
    category: 'Beverages',
    stockQuantity: 45,
    sku: 'COF001',
    cost: 10.50
  },
  {
    id: '2',
    name: 'Wireless Earbuds',
    price: 89.99,
    description: 'High-quality sound with noise cancellation',
    category: 'Electronics',
    stockQuantity: 20,
    sku: 'EAR002',
    cost: 45.00
  },
  {
    id: '3',
    name: 'Fitness Tracker',
    price: 59.99,
    description: 'Monitor your activities and health metrics',
    category: 'Electronics',
    stockQuantity: 15,
    sku: 'FIT003',
    cost: 25.00
  },
  {
    id: '4',
    name: 'Smart Notebook',
    price: 24.99,
    description: 'Digitize your handwritten notes instantly',
    category: 'Office Supplies',
    stockQuantity: 30,
    sku: 'NTB004',
    cost: 12.00
  },
  {
    id: '5',
    name: 'Portable Charger',
    price: 39.99,
    description: '20,000mAh fast-charging power bank',
    category: 'Electronics',
    stockQuantity: 25,
    sku: 'CHR005',
    cost: 18.50
  },
  {
    id: '6',
    name: 'Water Bottle',
    price: 15.99,
    description: 'Insulated stainless steel water bottle',
    category: 'Accessories',
    stockQuantity: 50,
    sku: 'BOT006',
    cost: 5.75
  },
];

const InventoryPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  
  React.useEffect(() => {
    // Speak page overview when the page loads
    const timer = setTimeout(() => {
      voiceAssistant.speakInventoryPage();
    }, 500);
    
    return () => {
      clearTimeout(timer);
      voiceAssistant.stopSpeaking();
    };
  }, []);

  const handleUpdateStock = (productId: string, newQuantity: number) => {
    setProducts(prevProducts => 
      prevProducts.map(p => 
        p.id === productId
          ? { ...p, stockQuantity: newQuantity } 
          : p
      )
    );
    
    const product = products.find(p => p.id === productId);
    if (product) {
      toast.success(`Updated ${product.name} stock to ${newQuantity}`);
    }
  };

  const handleAddProduct = () => {
    toast.info("Add product functionality will be implemented in a future update");
  };

  const handleEditProduct = (product: Product) => {
    toast.info(`Edit product: ${product.name} - functionality coming soon`);
  };

  const handleDeleteProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      toast.success(`Deleted ${product.name} from inventory`);
      setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <MainNavigation />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm py-4 px-6">
          <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          <Inventory 
            products={products}
            onUpdateStock={handleUpdateStock}
            onAddProduct={handleAddProduct}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        </main>
      </div>
    </div>
  );
};

export default InventoryPage;

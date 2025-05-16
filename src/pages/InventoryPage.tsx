
import React, { useState, useEffect } from 'react';
import { voiceAssistant } from '@/services/VoiceAssistant';
import { Product } from '@/types';
import { productData } from '@/data/products';
import { useShop } from '@/context/ShopContext';
import { InventoryPageLayout } from '@/components/inventory/InventoryPageLayout';
import { InventoryContent } from '@/components/inventory/InventoryContent';

const InventoryPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(productData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    description: '',
    category: '',
    stockQuantity: 0,
    sku: '',
    cost: 0,
    supplierId: '',
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const { currentShop } = useShop();
  
  useEffect(() => {
    // Speak page overview when the page loads
    const timer = setTimeout(() => {
      voiceAssistant.speakInventoryPage();
    }, 500);
    
    return () => {
      clearTimeout(timer);
      voiceAssistant.stopSpeaking();
    };
  }, []);

  return (
    <InventoryPageLayout currentShop={currentShop}>
      <InventoryContent 
        currentShop={currentShop}
        products={products}
        setProducts={setProducts}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        editingProduct={editingProduct}
        setEditingProduct={setEditingProduct}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
      />
    </InventoryPageLayout>
  );
};

export default InventoryPage;

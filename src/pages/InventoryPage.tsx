
import React, { useState, useEffect } from 'react';
import { voiceAssistant } from '@/services/VoiceAssistant';
import { Product } from '@/types';
import { db } from '@/services/LocalStorageDB';
import { useShop } from '@/context/ShopContext';
import { InventoryPageLayout } from '@/components/inventory/InventoryPageLayout';
import { InventoryContent } from '@/components/inventory/InventoryContent';
import { toast } from 'sonner';

const InventoryPage: React.FC = () => {
  // Use LocalStorageDB to get dynamic product data
  const [products, setProducts] = useState<Product[]>([]);
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
  
  // Load products from LocalStorageDB
  useEffect(() => {
    // Fetch products from database
    const loadedProducts = db.getCollection<Product>('products');
    setProducts(loadedProducts);
    
    // Speak page overview when the page loads
    const timer = setTimeout(() => {
      voiceAssistant.speakInventoryPage();
    }, 500);
    
    return () => {
      clearTimeout(timer);
      voiceAssistant.stopSpeaking();
    };
  }, []);
  
  // Update products in LocalStorageDB when they change
  useEffect(() => {
    if (products.length > 0) {
      db.saveCollection('products', products);
      console.log('Products saved to local storage database');
    }
  }, [products]);
  
  // Handle shop change
  useEffect(() => {
    if (currentShop) {
      // In a real app, we would filter products by shop ID
      // For now, we'll reload all products
      const shopProducts = db.getCollection<Product>('products');
      setProducts(shopProducts);
      toast.info(`Loaded inventory for ${currentShop.name}`);
    }
  }, [currentShop?.id]);

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

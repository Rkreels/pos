
import React, { useState, useEffect } from 'react';
import { Product, CartItem } from '@/types';
import { ProductList } from '@/components/ProductList';
import { Cart } from '@/components/Cart';
import { voiceAssistant } from '@/services/VoiceAssistant';

// Sample products data
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Coffee',
    price: 19.99,
    description: 'Freshly roasted arabica coffee beans',
  },
  {
    id: '2',
    name: 'Wireless Earbuds',
    price: 89.99,
    description: 'High-quality sound with noise cancellation',
  },
  {
    id: '3',
    name: 'Fitness Tracker',
    price: 59.99,
    description: 'Monitor your activities and health metrics',
  },
  {
    id: '4',
    name: 'Smart Notebook',
    price: 24.99,
    description: 'Digitize your handwritten notes instantly',
  },
  {
    id: '5',
    name: 'Portable Charger',
    price: 39.99,
    description: '20,000mAh fast-charging power bank',
  },
  {
    id: '6',
    name: 'Water Bottle',
    price: 15.99,
    description: 'Insulated stainless steel water bottle',
  },
];

const Index = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
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

  const calculateTotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  };

  const handleAddToCart = (product: Product) => {
    // First stop any current speech
    voiceAssistant.stopSpeaking();
    
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id);
      const newItems = existingItem
        ? prevItems.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prevItems, { product, quantity: 1 }];
      
      // Calculate new total after state update
      setTimeout(() => {
        const total = newItems.reduce(
          (sum, item) => sum + item.product.price * item.quantity, 
          0
        );
        // Speak product added confirmation
        voiceAssistant.speakProductAdded(product.name, total);
      }, 0);
      
      return newItems;
    });
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    // First stop any current speech
    voiceAssistant.stopSpeaking();
    
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      );
      
      // Find the product name for the voice message
      const product = prevItems.find(item => item.product.id === productId)?.product;
      if (product) {
        setTimeout(() => {
          const total = updatedItems.reduce(
            (sum, item) => sum + item.product.price * item.quantity, 
            0
          );
          // Speak quantity updated confirmation
          voiceAssistant.speakQuantityUpdated(product.name, newQuantity, total);
        }, 0);
      }
      
      return updatedItems;
    });
  };

  const handleRemoveItem = (productId: string) => {
    // First stop any current speech
    voiceAssistant.stopSpeaking();
    
    // Find the product before removing it
    const productToRemove = cartItems.find(item => item.product.id === productId)?.product;
    
    setCartItems((prevItems) => {
      const filteredItems = prevItems.filter((item) => item.product.id !== productId);
      
      if (productToRemove) {
        setTimeout(() => {
          const total = filteredItems.reduce(
            (sum, item) => sum + item.product.price * item.quantity, 
            0
          );
          // Speak item removed confirmation
          voiceAssistant.speakItemRemoved(productToRemove.name, total);
        }, 0);
      }
      
      return filteredItems;
    });
  };

  const handleCheckout = () => {
    // First stop any current speech
    voiceAssistant.stopSpeaking();
    
    const totalItems = cartItems.reduce((count, item) => count + item.quantity, 0);
    const total = calculateTotal();
    
    // Speak checkout confirmation
    voiceAssistant.speakCheckout(totalItems, total);
    
    // Clear cart after checkout
    setCartItems([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-800">Voice-Enabled POS System</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <ProductList products={sampleProducts} onAddToCart={handleAddToCart} />
          </div>
          <div className="w-full lg:w-96">
            <Cart
              items={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

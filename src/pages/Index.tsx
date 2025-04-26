
import React, { useState } from 'react';
import { Product, CartItem } from '@/types';
import { ProductList } from '@/components/ProductList';
import { Cart } from '@/components/Cart';
import { voiceAssistant } from '@/services/VoiceAssistant';

// Sample products data
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Product 1',
    price: 19.99,
    description: 'Sample product description',
  },
  {
    id: '2',
    name: 'Product 2',
    price: 29.99,
    description: 'Another sample product',
  },
  {
    id: '3',
    name: 'Product 3',
    price: 39.99,
    description: 'Yet another sample product',
  },
];

const Index = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleAddToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId)
    );
  };

  const handleCheckout = () => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    voiceAssistant.speak(
      `Processing your order for a total of $${total.toFixed(2)}. Thank you for your purchase!`
    );
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

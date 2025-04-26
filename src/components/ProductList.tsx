
import React from 'react';
import { Product } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { voiceAssistant } from '@/services/VoiceAssistant';

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ products, onAddToCart }) => {
  const handleAddToCart = (product: Product) => {
    onAddToCart(product);
    voiceAssistant.speak(`Added ${product.name} to your cart. You can add more items or proceed to checkout.`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {products.map((product) => (
        <Card key={product.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
            <p className="text-gray-600 mb-2">{product.description}</p>
            <p className="text-lg font-bold mb-4">${product.price.toFixed(2)}</p>
            <Button 
              onClick={() => handleAddToCart(product)}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              Add to Cart
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

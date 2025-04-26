
import React, { useState } from 'react';
import { Product } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { voiceAssistant } from '@/services/VoiceAssistant';
import { Input } from '@/components/ui/input';
import { Search, Tag, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ products, onAddToCart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  // Extract unique categories
  const categories = [...new Set(products.map(product => product.category))].filter(Boolean);
  
  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: Product) => {
    onAddToCart(product);
    // Voice assistant will be called with the calculated total in the Index page
  };

  React.useEffect(() => {
    // Provide an overview of the products page when it loads
    const timer = setTimeout(() => {
      voiceAssistant.speak(
        "Here are the available products. You can search for items using the search bar or filter by category. Browse through the items and click 'Add to Cart' for products you'd like to purchase."
      );
    }, 1000); // Slight delay to ensure page is rendered
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-2 md:items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {categories.map(category => (
            <Badge 
              key={category} 
              variant={categoryFilter === category ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setCategoryFilter(categoryFilter === category ? null : category)}
            >
              <Tag className="h-3.5 w-3.5 mr-1" />
              {category}
            </Badge>
          ))}
        </div>
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No products found matching your search
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  {product.category && (
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600 mb-2 text-sm line-clamp-2">{product.description}</p>
                {product.stockQuantity !== undefined && (
                  <p className="text-xs text-gray-500 mb-2">
                    In stock: {product.stockQuantity} {product.stockQuantity === 1 ? 'unit' : 'units'}
                  </p>
                )}
                <div className="flex justify-between items-center mt-4">
                  <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
                  <Button 
                    onClick={() => handleAddToCart(product)}
                    className="bg-indigo-600 hover:bg-indigo-700"
                    size="sm"
                    disabled={product.stockQuantity !== undefined && product.stockQuantity <= 0}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

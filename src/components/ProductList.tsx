
import React, { useState, useEffect } from 'react';
import { Product } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { voiceAssistant } from '@/services/VoiceAssistant';
import { Input } from '@/components/ui/input';
import { Search, Tag, ShoppingCart, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ products, onAddToCart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  const categories = [...new Set(products.map(product => product.category))].filter(Boolean);
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: Product) => {
    onAddToCart(product);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      voiceAssistant.speak(
        "Here are the available products. You can search for items using the search bar or filter by category. Browse through the items and click 'Add to Cart' for products you'd like to purchase. All product information and availability is updated in real-time from your inventory."
      );
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Speak guidance when filter is used
  useEffect(() => {
    if (searchTerm) {
      voiceAssistant.speakProductSearch();
    }
  }, [searchTerm]);

  useEffect(() => {
    if (categoryFilter) {
      voiceAssistant.speakCategoryFilter();
    }
  }, [categoryFilter]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
            aria-label="Search products"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Badge 
              key={category} 
              variant={categoryFilter === category ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/80 transition-colors"
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
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-2">
                <div className="flex flex-col h-full">
                  <div className="aspect-square bg-gray-100 rounded-md mb-2 overflow-hidden relative">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ImageIcon className="h-8 w-8" />
                      </div>
                    )}
                    {product.stockQuantity !== undefined && product.stockQuantity <= 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                        <div className="bg-red-500 text-white text-xs px-2 py-1 rounded flex items-center">
                          <AlertTriangle className="h-3 w-3 mr-1" /> Out of Stock
                        </div>
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-xs truncate" title={product.name}>{product.name}</h3>
                  <p className="text-xs text-gray-600 line-clamp-1" title={product.description}>
                    {product.description}
                  </p>
                  <div className="mt-auto pt-2">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-semibold">${product.price.toFixed(2)}</p>
                      <Button 
                        onClick={() => handleAddToCart(product)}
                        className="h-6 px-1.5"
                        size="sm"
                        disabled={product.stockQuantity !== undefined && product.stockQuantity <= 0}
                        title={product.stockQuantity !== undefined && product.stockQuantity <= 0 ? "Out of stock" : "Add to cart"}
                      >
                        <ShoppingCart className="h-3 w-3" />
                      </Button>
                    </div>
                    {product.stockQuantity !== undefined && (
                      <p className={`text-xs mt-1 ${product.stockQuantity <= 0 ? 'text-red-500' : product.stockQuantity < 5 ? 'text-orange-500' : 'text-gray-500'}`}>
                        {product.stockQuantity === 0 ? 'Out of stock' : product.stockQuantity < 5 ? `Low stock: ${product.stockQuantity}` : `Stock: ${product.stockQuantity}`}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

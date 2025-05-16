
import React, { useState, useEffect } from 'react';
import { Product } from '@/types';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Edit, Package, Plus, Tag, Trash } from 'lucide-react';
import { voiceAssistant } from '@/services/VoiceAssistant';

interface InventoryProps {
  products: Product[];
  onUpdateStock: (productId: string, newQuantity: number) => void;
  onAddProduct?: () => void;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (productId: string) => void;
}

export const Inventory: React.FC<InventoryProps> = ({
  products,
  onUpdateStock,
  onAddProduct,
  onEditProduct,
  onDeleteProduct
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof Product | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Extract unique categories
  const categories = [...new Set(products.map(product => product.category))].filter(Boolean) as string[];
  
  // Sort and filter products based on search term, category, and sort field
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.barcode && product.barcode.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = !categoryFilter || product.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' 
          ? aValue - bValue 
          : bValue - aValue;
      }
      
      return 0;
    });

  // Handle sort toggle
  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Check for low stock items and alert
  useEffect(() => {
    const lowStockThreshold = 5;
    const lowStockProducts = products.filter(p => 
      p.stockQuantity !== undefined && 
      p.stockQuantity > 0 && 
      p.stockQuantity <= lowStockThreshold
    );
    
    const outOfStockProducts = products.filter(p => 
      p.stockQuantity !== undefined && 
      p.stockQuantity === 0
    );
    
    // Alert for low stock items (limit to 3 to avoid too many alerts)
    lowStockProducts.slice(0, 3).forEach(product => {
      voiceAssistant.speakLowStockWarning(product.name, product.stockQuantity || 0);
    });
    
    // Alert for out of stock items (limit to 3)
    outOfStockProducts.slice(0, 3).forEach(product => {
      voiceAssistant.speakOutOfStock(product.name);
    });
  }, []);
  
  // Provide detailed voice guidance when the component loads
  React.useEffect(() => {
    // Provide an overview of the inventory table
    const timer = setTimeout(() => {
      voiceAssistant.speakInventoryTableDetails();
      voiceAssistant.speakInventoryFilterDetails();
    }, 2000);
    
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight flex items-center">
          <Package className="h-6 w-6 mr-2" /> Inventory Management
        </h2>
        <Button 
          onClick={onAddProduct} 
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Product
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-2 md:items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search by name, SKU, barcode..."
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
      
      <Table>
        <TableCaption>Inventory as of {new Date().toLocaleDateString()}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50" 
              onClick={() => handleSort('name')}
            >
              Product Name {sortField === 'name' && (sortDirection === 'asc' ? '▲' : '▼')}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50" 
              onClick={() => handleSort('sku')}
            >
              SKU {sortField === 'sku' && (sortDirection === 'asc' ? '▲' : '▼')}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50" 
              onClick={() => handleSort('category')}
            >
              Category {sortField === 'category' && (sortDirection === 'asc' ? '▲' : '▼')}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50 text-right" 
              onClick={() => handleSort('price')}
            >
              Price {sortField === 'price' && (sortDirection === 'asc' ? '▲' : '▼')}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50 text-right" 
              onClick={() => handleSort('cost')}
            >
              Cost {sortField === 'cost' && (sortDirection === 'asc' ? '▲' : '▼')}
            </TableHead>
            <TableHead className="text-right">Profit</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-50 text-right" 
              onClick={() => handleSort('stockQuantity')}
            >
              Stock {sortField === 'stockQuantity' && (sortDirection === 'asc' ? '▲' : '▼')}
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                No products found matching your search criteria
              </TableCell>
            </TableRow>
          ) : (
            filteredProducts.map((product) => {
              const profit = product.cost ? product.price - product.cost : undefined;
              const profitMargin = profit && product.price ? (profit / product.price * 100).toFixed(1) : undefined;
              
              return (
                <TableRow key={product.id} className={product.stockQuantity === 0 ? 'bg-red-50' : (product.stockQuantity && product.stockQuantity < 5 ? 'bg-yellow-50' : '')}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.sku || '-'}</TableCell>
                  <TableCell>{product.category || '-'}</TableCell>
                  <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${product.cost?.toFixed(2) || '-'}</TableCell>
                  <TableCell className="text-right">
                    {profit !== undefined ? `$${profit.toFixed(2)} (${profitMargin}%)` : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onUpdateStock(product.id, (product.stockQuantity || 0) - 1)}
                        disabled={(product.stockQuantity || 0) <= 0}
                      >
                        -
                      </Button>
                      <span className={`w-10 text-center ${product.stockQuantity === 0 ? 'text-red-600 font-bold' : (product.stockQuantity && product.stockQuantity < 5 ? 'text-yellow-600 font-bold' : '')}`}>
                        {product.stockQuantity || 0}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onUpdateStock(product.id, (product.stockQuantity || 0) + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => onEditProduct?.(product)}
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => onDeleteProduct?.(product.id)}
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

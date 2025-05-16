
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Product, Supplier } from '@/types';
import { DialogFooter } from '@/components/ui/dialog';

interface ProductFormProps {
  newProduct: Partial<Product>;
  setNewProduct: React.Dispatch<React.SetStateAction<Partial<Product>>>;
  newCategory: string;
  setNewCategory: React.Dispatch<React.SetStateAction<string>>;
  categories: string[];
  suppliers: Supplier[];
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSaveProduct: () => void;
  editingProduct: Product | null;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  newProduct,
  setNewProduct,
  newCategory,
  setNewCategory,
  categories,
  suppliers,
  isDialogOpen,
  setIsDialogOpen,
  handleSaveProduct,
  editingProduct
}) => {
  // Ensure we have safe values for dropdowns
  const safeCategory = newProduct.category || "";
  const safeSupplierId = newProduct.supplierId || "";

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">Name</Label>
        <Input
          id="name"
          value={newProduct.name || ""}
          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
          className="col-span-3"
          placeholder="Product name"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="price" className="text-right">Price ($)</Label>
        <Input
          id="price"
          type="number"
          min="0"
          step="0.01"
          value={newProduct.price || 0}
          onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
          className="col-span-3"
          placeholder="Selling price"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="cost" className="text-right">Cost ($)</Label>
        <Input
          id="cost"
          type="number"
          min="0"
          step="0.01"
          value={newProduct.cost || 0}
          onChange={(e) => setNewProduct({...newProduct, cost: parseFloat(e.target.value) || 0})}
          className="col-span-3"
          placeholder="Purchase cost"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="sku" className="text-right">SKU</Label>
        <Input
          id="sku"
          value={newProduct.sku || ""}
          onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
          className="col-span-3"
          placeholder="Stock keeping unit"
        />
      </div>
      
      {/* Category Selection */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="category" className="text-right">Category</Label>
        {newCategory ? (
          <div className="col-span-3 flex gap-2">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1"
              placeholder="New category name"
            />
            <Button 
              variant="outline" 
              onClick={() => {
                setNewCategory('');
                setNewProduct({...newProduct, category: ''});
              }}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div className="col-span-3 flex gap-2">
            <Select 
              value={safeCategory || "no-category"} 
              onValueChange={(value) => {
                if (value === "new") {
                  setNewCategory('');
                } else if (value === "no-category") {
                  setNewProduct({...newProduct, category: ''});
                } else {
                  setNewProduct({...newProduct, category: value});
                }
              }}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-category">Select a category</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
                <SelectItem value="new">+ Add New Category</SelectItem>
              </SelectContent>
            </Select>
            {safeCategory && (
              <Button 
                variant="outline" 
                onClick={() => setNewCategory('New Category')}
              >
                New
              </Button>
            )}
          </div>
        )}
      </div>
      
      {/* Supplier Selection */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="supplier" className="text-right">Supplier</Label>
        <Select 
          value={safeSupplierId || "no-supplier"} 
          onValueChange={(value) => setNewProduct({...newProduct, supplierId: value === "no-supplier" ? "" : value})}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select a supplier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no-supplier">No supplier</SelectItem>
            {suppliers.map(supplier => (
              <SelectItem key={supplier.id} value={supplier.id}>
                {supplier.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="quantity" className="text-right">Quantity</Label>
        <Input
          id="quantity"
          type="number"
          min="0"
          value={newProduct.stockQuantity || 0}
          onChange={(e) => setNewProduct({...newProduct, stockQuantity: parseInt(e.target.value) || 0})}
          className="col-span-3"
          placeholder="Initial stock quantity"
        />
      </div>
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="description" className="text-right">Description</Label>
        <Textarea
          id="description"
          value={newProduct.description || ""}
          onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
          className="col-span-3"
          rows={4}
          placeholder="Product description"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="image" className="text-right">Image URL</Label>
        <Input
          id="image"
          value={newProduct.image || ""}
          onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
          className="col-span-3"
          placeholder="Image URL (leave empty for random image)"
        />
      </div>
      
      {/* Footer with action buttons */}
      <DialogFooter>
        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
          Cancel
        </Button>
        <Button type="button" onClick={handleSaveProduct}>
          {editingProduct ? 'Update' : 'Add'}
        </Button>
      </DialogFooter>
    </div>
  );
};


import React, { useState } from 'react';
import { MainNavigation } from '@/components/MainNavigation';
import { Inventory } from '@/components/Inventory';
import { Product } from '@/types';
import { toast } from 'sonner';
import { voiceAssistant } from '@/services/VoiceAssistant';
import { productData } from '@/data/products';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
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

  const categories = [...new Set(products.map(product => product.category))].filter(Boolean);

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
    setEditingProduct(null);
    setNewProduct({
      name: '',
      price: 0,
      description: '',
      category: '',
      stockQuantity: 0,
      sku: '',
      cost: 0,
    });
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct(product);
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      toast.success(`Deleted ${product.name} from inventory`);
      setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
    }
  };

  const handleSaveProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      toast.error('Name and price are required');
      return;
    }

    if (editingProduct) {
      // Update existing product
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === editingProduct.id
            ? { ...p, ...newProduct }
            : p
        )
      );
      toast.success(`Updated ${newProduct.name}`);
    } else {
      // Add new product
      const productToAdd = {
        ...newProduct,
        id: `${Date.now()}`, // Simple ID generation
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300' // Default image
      } as Product;
      
      setProducts(prevProducts => [...prevProducts, productToAdd]);
      toast.success(`Added ${newProduct.name} to inventory`);
    }
    
    setIsDialogOpen(false);
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
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                <DialogDescription>
                  {editingProduct 
                    ? 'Update the details of your product.' 
                    : 'Add a new product to your inventory.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cost" className="text-right">Cost ($)</Label>
                  <Input
                    id="cost"
                    type="number"
                    value={newProduct.cost}
                    onChange={(e) => setNewProduct({...newProduct, cost: parseFloat(e.target.value) || 0})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sku" className="text-right">SKU</Label>
                  <Input
                    id="sku"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">Category</Label>
                  <Select 
                    value={newProduct.category} 
                    onValueChange={(value) => setNewProduct({...newProduct, category: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                      <SelectItem value="New">+ Add New Category</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newProduct.category === 'New' && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="newCategory" className="text-right">New Category</Label>
                    <Input
                      id="newCategory"
                      value=""
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      className="col-span-3"
                      placeholder="Enter new category name"
                    />
                  </div>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="quantity" className="text-right">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newProduct.stockQuantity}
                    onChange={(e) => setNewProduct({...newProduct, stockQuantity: parseInt(e.target.value) || 0})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="description" className="text-right">Description</Label>
                  <Textarea
                    id="description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleSaveProduct}>
                  {editingProduct ? 'Update' : 'Add'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default InventoryPage;

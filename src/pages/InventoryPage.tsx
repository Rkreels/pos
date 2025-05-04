
import React, { useState } from 'react';
import { MainNavigation } from '@/components/MainNavigation';
import { Inventory } from '@/components/Inventory';
import { InventoryExchange } from '@/components/InventoryExchange';
import { Product } from '@/types';
import { toast } from 'sonner';
import { voiceAssistant } from '@/services/VoiceAssistant';
import { productData } from '@/data/products';
import { supplierData } from '@/data/suppliers';
import { useShop } from '@/context/ShopContext'; // Import shop context
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
    supplierId: '',
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const { currentShop } = useShop(); // Get current shop
  
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
  
  // Sample product images for new products
  const sampleImages = [
    'https://images.unsplash.com/photo-1567722681579-c673e675e296?q=80&w=300',
    'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=300',
    'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=300',
    'https://images.unsplash.com/photo-1578312765176-3b5a8138e21b?q=80&w=300',
    'https://images.unsplash.com/photo-1525904097878-94fb15835963?q=80&w=300',
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=300',
    'https://images.unsplash.com/photo-1601053044517-460df83b2138?q=80&w=300',
    'https://images.unsplash.com/photo-1595535873420-a599195b3f4a?q=80&w=300',
    'https://images.unsplash.com/photo-1606248897732-2c5ffe759c04?q=80&w=300',
    'https://images.unsplash.com/photo-1556695869-9774cba7957f?q=80&w=300',
  ];

  const handleUpdateStock = (productId: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    
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
      supplierId: '',
    });
    setNewCategory('');
    setIsDialogOpen(true);
    voiceAssistant.speakAddProduct();
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({...product});
    setNewCategory('');
    setIsDialogOpen(true);
    voiceAssistant.speakEditProduct();
  };

  const handleDeleteProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      toast.success(`Deleted ${product.name} from inventory`);
      setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
    }
  };

  const handleSaveProduct = () => {
    if (!newProduct.name || newProduct.price === undefined || newProduct.price <= 0) {
      toast.error('Name and a valid price are required');
      return;
    }

    // Handle new category
    let finalCategory = newProduct.category;
    if (newCategory) {
      finalCategory = newCategory;
    }

    // Get a random image from the sample images
    let productImage = newProduct.image;
    if (!productImage) {
      const randomIndex = Math.floor(Math.random() * sampleImages.length);
      productImage = sampleImages[randomIndex];
    }

    if (editingProduct) {
      // Update existing product
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === editingProduct.id
            ? { 
                ...p, 
                ...newProduct,
                category: finalCategory,
                image: productImage
              }
            : p
        )
      );
      toast.success(`Updated ${newProduct.name}`);
    } else {
      // Add new product
      const productToAdd = {
        ...newProduct,
        category: finalCategory,
        id: `p${Date.now()}`, // Simple ID generation with prefix
        image: productImage
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
          <h1 className="text-2xl font-bold text-gray-800">
            Inventory Management
            {currentShop && <span className="text-base font-normal ml-2">({currentShop.name})</span>}
          </h1>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          {currentShop ? (
            <>
              <InventoryExchange products={products} setProducts={setProducts} />
              
              <Inventory 
                products={products}
                onUpdateStock={handleUpdateStock}
                onAddProduct={handleAddProduct}
                onEditProduct={handleEditProduct}
                onDeleteProduct={handleDeleteProduct}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 border rounded-lg">
              <p className="text-xl mb-4">Please select a shop to view inventory</p>
              <Button variant="outline" onClick={() => toast.info("Please select a shop from the shop selector")}>
                Select Shop
              </Button>
            </div>
          )}
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
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
                    value={newProduct.price}
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
                    value={newProduct.cost}
                    onChange={(e) => setNewProduct({...newProduct, cost: parseFloat(e.target.value) || 0})}
                    className="col-span-3"
                    placeholder="Purchase cost"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sku" className="text-right">SKU</Label>
                  <Input
                    id="sku"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                    className="col-span-3"
                    placeholder="Stock keeping unit"
                  />
                </div>
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
                        value={newProduct.category} 
                        onValueChange={(value) => {
                          if (value === "new") {
                            setNewCategory('');
                          } else {
                            setNewProduct({...newProduct, category: value});
                          }
                        }}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Select a category</SelectItem>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                          <SelectItem value="new">+ Add New Category</SelectItem>
                        </SelectContent>
                      </Select>
                      {newProduct.category && (
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
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="supplier" className="text-right">Supplier</Label>
                  <Select 
                    value={newProduct.supplierId || ''} 
                    onValueChange={(value) => setNewProduct({...newProduct, supplierId: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No supplier</SelectItem>
                      {supplierData.map(supplier => (
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
                    value={newProduct.stockQuantity}
                    onChange={(e) => setNewProduct({...newProduct, stockQuantity: parseInt(e.target.value) || 0})}
                    className="col-span-3"
                    placeholder="Initial stock quantity"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="description" className="text-right">Description</Label>
                  <Textarea
                    id="description"
                    value={newProduct.description}
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
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                    className="col-span-3"
                    placeholder="Image URL (leave empty for random image)"
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

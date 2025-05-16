
import React, { useState } from 'react';
import { MainNavigation } from '@/components/MainNavigation';
import { Inventory } from '@/components/Inventory';
import { InventoryExchange } from '@/components/InventoryExchange';
import { Product } from '@/types';
import { toast } from 'sonner';
import { voiceAssistant } from '@/services/VoiceAssistant';
import { productData } from '@/data/products';
import { supplierData } from '@/data/suppliers';
import { useShop } from '@/context/ShopContext'; 
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ProductForm } from '@/components/inventory/ProductForm';
import { Plus } from 'lucide-react';

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
              
              <ProductForm
                newProduct={newProduct}
                setNewProduct={setNewProduct}
                newCategory={newCategory}
                setNewCategory={setNewCategory}
                categories={categories}
                suppliers={supplierData}
                isDialogOpen={isDialogOpen}
                setIsDialogOpen={setIsDialogOpen}
                handleSaveProduct={handleSaveProduct}
                editingProduct={editingProduct}
              />
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default InventoryPage;


import React from 'react';
import { Product } from '@/types';
import { InventoryExchange } from '@/components/InventoryExchange';
import { Inventory } from '@/components/Inventory';
import { NoShopSelected } from '@/components/inventory/NoShopSelected';
import { ProductDialog } from '@/components/inventory/ProductDialog';
import { supplierData } from '@/data/suppliers';
import { toast } from 'sonner';
import { voiceAssistant } from '@/services/VoiceAssistant';

interface InventoryContentProps {
  currentShop: any;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newProduct: Partial<Product>;
  setNewProduct: React.Dispatch<React.SetStateAction<Partial<Product>>>;
  editingProduct: Product | null;
  setEditingProduct: React.Dispatch<React.SetStateAction<Product | null>>;
  newCategory: string;
  setNewCategory: React.Dispatch<React.SetStateAction<string>>;
}

export const InventoryContent: React.FC<InventoryContentProps> = ({
  currentShop,
  products,
  setProducts,
  isDialogOpen,
  setIsDialogOpen,
  newProduct,
  setNewProduct,
  editingProduct,
  setEditingProduct,
  newCategory,
  setNewCategory
}) => {
  // Extract unique categories from products
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
      voiceAssistant.speak(`Updated ${product.name} stock quantity to ${newQuantity}`);
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
    voiceAssistant.speak("Please fill in the product details to add a new item to your inventory.");
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({...product});
    setNewCategory('');
    setIsDialogOpen(true);
    voiceAssistant.speak(`Editing ${product.name}. You can modify the product details as needed.`);
  };

  const handleDeleteProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      toast.success(`Deleted ${product.name} from inventory`);
      setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
      voiceAssistant.speak(`${product.name} has been removed from your inventory.`);
    }
  };

  const handleSaveProduct = () => {
    if (!newProduct.name || newProduct.price === undefined || newProduct.price <= 0) {
      toast.error('Name and a valid price are required');
      voiceAssistant.speak("Please provide a product name and a valid price before saving.");
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
      voiceAssistant.speak(`${newProduct.name} has been successfully updated in your inventory.`);
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
      voiceAssistant.speak(`${newProduct.name} has been successfully added to your inventory.`);
    }
    
    setIsDialogOpen(false);
  };

  return (
    <>
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
        <NoShopSelected />
      )}
      
      <ProductDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        categories={categories}
        suppliers={supplierData}
        handleSaveProduct={handleSaveProduct}
        editingProduct={editingProduct}
      />
    </>
  );
};

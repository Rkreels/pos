import React, { useState, useEffect } from 'react';
import { Product, CartItem, SalesData } from '@/types';
import { ProductList } from '@/components/ProductList';
import { Cart } from '@/components/Cart';
import { voiceAssistant } from '@/services/VoiceAssistant';
import { MainNavigation } from '@/components/MainNavigation';
import { Dashboard } from '@/components/Dashboard';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ShoppingCart, LayoutDashboard } from 'lucide-react';

// Sample products data with additional properties
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Coffee',
    price: 19.99,
    description: 'Freshly roasted arabica coffee beans',
    category: 'Beverages',
    stockQuantity: 45,
    sku: 'COF001',
    cost: 10.50
  },
  {
    id: '2',
    name: 'Wireless Earbuds',
    price: 89.99,
    description: 'High-quality sound with noise cancellation',
    category: 'Electronics',
    stockQuantity: 20,
    sku: 'EAR002',
    cost: 45.00
  },
  {
    id: '3',
    name: 'Fitness Tracker',
    price: 59.99,
    description: 'Monitor your activities and health metrics',
    category: 'Electronics',
    stockQuantity: 15,
    sku: 'FIT003',
    cost: 25.00
  },
  {
    id: '4',
    name: 'Smart Notebook',
    price: 24.99,
    description: 'Digitize your handwritten notes instantly',
    category: 'Office Supplies',
    stockQuantity: 30,
    sku: 'NTB004',
    cost: 12.00
  },
  {
    id: '5',
    name: 'Portable Charger',
    price: 39.99,
    description: '20,000mAh fast-charging power bank',
    category: 'Electronics',
    stockQuantity: 25,
    sku: 'CHR005',
    cost: 18.50
  },
  {
    id: '6',
    name: 'Water Bottle',
    price: 15.99,
    description: 'Insulated stainless steel water bottle',
    category: 'Accessories',
    stockQuantity: 50,
    sku: 'BOT006',
    cost: 5.75
  },
  {
    id: '7',
    name: 'Bluetooth Speaker',
    price: 49.99,
    description: 'Portable waterproof speaker with deep bass',
    category: 'Electronics',
    stockQuantity: 18,
    sku: 'SPK007',
    cost: 22.00
  },
  {
    id: '8',
    name: 'Organic Green Tea',
    price: 12.99,
    description: 'Premium loose leaf green tea, pack of 50g',
    category: 'Beverages',
    stockQuantity: 35,
    sku: 'TEA008',
    cost: 6.00
  },
  {
    id: '9',
    name: 'Mechanical Keyboard',
    price: 99.99,
    description: 'RGB backlit mechanical gaming keyboard',
    category: 'Electronics',
    stockQuantity: 12,
    sku: 'KEY009',
    cost: 45.50
  },
];

// Sample dashboard data
const sampleSalesData: SalesData[] = [
  { date: 'Jan 1', sales: 4000, transactions: 24 },
  { date: 'Jan 2', sales: 3000, transactions: 18 },
  { date: 'Jan 3', sales: 2000, transactions: 12 },
  { date: 'Jan 4', sales: 2780, transactions: 16 },
  { date: 'Jan 5', sales: 1890, transactions: 11 },
  { date: 'Jan 6', sales: 2390, transactions: 14 },
  { date: 'Jan 7', sales: 3490, transactions: 21 },
];

const sampleTopSellingProducts = [
  { id: '1', name: 'Premium Coffee', sold: 42 },
  { id: '2', name: 'Wireless Earbuds', sold: 38 },
  { id: '7', name: 'Bluetooth Speaker', sold: 27 },
  { id: '5', name: 'Portable Charger', sold: 23 },
];

const sampleRecentActivity = [
  { id: '1', action: 'New order #12345 processed', time: '10 mins ago' },
  { id: '2', action: 'Inventory updated for Premium Coffee', time: '25 mins ago' },
  { id: '3', action: 'Customer John D. registered', time: '1 hour ago' },
  { id: '4', action: 'Daily sales report generated', time: '2 hours ago' },
];

const Index = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeView, setActiveView] = useState<'dashboard' | 'pos'>('dashboard');
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  
  useEffect(() => {
    // Speak page overview when the page loads
    const timer = setTimeout(() => {
      voiceAssistant.speakPageOverview();
    }, 500);
    
    return () => {
      clearTimeout(timer);
      voiceAssistant.stopSpeaking();
    };
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  };

  const handleAddToCart = (product: Product) => {
    // First stop any current speech
    voiceAssistant.stopSpeaking();
    
    // Check if product is in stock
    if (product.stockQuantity !== undefined && product.stockQuantity <= 0) {
      toast.error(`${product.name} is out of stock`);
      return;
    }
    
    // Update product stock
    setProducts(prevProducts => 
      prevProducts.map(p => 
        p.id === product.id 
          ? { ...p, stockQuantity: (p.stockQuantity || 0) - 1 } 
          : p
      )
    );
    
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id);
      const newItems = existingItem
        ? prevItems.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prevItems, { product, quantity: 1 }];
      
      // Calculate new total after state update
      setTimeout(() => {
        const total = newItems.reduce(
          (sum, item) => sum + item.product.price * item.quantity, 
          0
        );
        // Speak product added confirmation
        voiceAssistant.speakProductAdded(product.name, total);
        toast.success(`Added ${product.name} to cart`);
      }, 0);
      
      return newItems;
    });
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    // First stop any current speech
    voiceAssistant.stopSpeaking();
    
    const item = cartItems.find(item => item.product.id === productId);
    const product = products.find(p => p.id === productId);
    
    if (!item || !product) return;
    
    const quantityDifference = newQuantity - item.quantity;
    
    // Check if we're increasing quantity and if we have enough stock
    if (quantityDifference > 0 && 
        product.stockQuantity !== undefined && 
        product.stockQuantity < quantityDifference) {
      toast.error(`Not enough ${product.name} in stock`);
      return;
    }
    
    // Update product stock
    setProducts(prevProducts => 
      prevProducts.map(p => 
        p.id === productId
          ? { ...p, stockQuantity: (p.stockQuantity || 0) - quantityDifference } 
          : p
      )
    );
    
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      );
      
      // Find the product name for the voice message
      const product = prevItems.find(item => item.product.id === productId)?.product;
      if (product) {
        setTimeout(() => {
          const total = updatedItems.reduce(
            (sum, item) => sum + item.product.price * item.quantity, 
            0
          );
          // Speak quantity updated confirmation
          voiceAssistant.speakQuantityUpdated(product.name, newQuantity, total);
          toast.success(`Updated ${product.name} quantity to ${newQuantity}`);
        }, 0);
      }
      
      return updatedItems;
    });
  };

  const handleRemoveItem = (productId: string) => {
    // First stop any current speech
    voiceAssistant.stopSpeaking();
    
    // Find the product before removing it
    const itemToRemove = cartItems.find(item => item.product.id === productId);
    
    if (itemToRemove) {
      // Return stock to inventory
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === productId
            ? { ...p, stockQuantity: (p.stockQuantity || 0) + itemToRemove.quantity } 
            : p
        )
      );
      
      setCartItems((prevItems) => {
        const filteredItems = prevItems.filter((item) => item.product.id !== productId);
        
        if (itemToRemove) {
          setTimeout(() => {
            const total = filteredItems.reduce(
              (sum, item) => sum + item.product.price * item.quantity, 
              0
            );
            // Speak item removed confirmation
            voiceAssistant.speakItemRemoved(itemToRemove.product.name, total);
            toast.success(`Removed ${itemToRemove.product.name} from cart`);
          }, 0);
        }
        
        return filteredItems;
      });
    }
  };

  const handleCheckout = () => {
    // First stop any current speech
    voiceAssistant.stopSpeaking();
    
    const totalItems = cartItems.reduce((count, item) => count + item.quantity, 0);
    const total = calculateTotal();
    
    // Speak checkout confirmation
    voiceAssistant.speakCheckout(totalItems, total);
    toast.success(`Order completed for ${totalItems} items with total $${total.toFixed(2)}`);
    
    // Clear cart after checkout
    setCartItems([]);
  };

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

  return (
    <div className="flex h-screen bg-gray-50">
      <MainNavigation />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm py-4 px-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {activeView === 'dashboard' ? 'Dashboard' : 'Point of Sale'}
              </h1>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={activeView === 'dashboard' ? 'default' : 'outline'}
                onClick={() => setActiveView('dashboard')}
              >
                <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
              </Button>
              <Button 
                variant={activeView === 'pos' ? 'default' : 'outline'}
                onClick={() => setActiveView('pos')}
              >
                <ShoppingCart className="h-4 w-4 mr-2" /> POS
              </Button>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          {activeView === 'dashboard' ? (
            <Dashboard 
              totalSales={12458.99}
              totalOrders={142}
              totalCustomers={64}
              totalProducts={products.length}
              salesData={sampleSalesData}
              topSellingProducts={sampleTopSellingProducts}
              recentActivity={sampleRecentActivity}
            />
          ) : (
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <ProductList products={products} onAddToCart={handleAddToCart} />
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
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;

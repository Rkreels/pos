
import React, { useState } from 'react';
import { Product, CartItem } from '@/types';
import { ProductList } from '@/components/ProductList';
import { Cart } from '@/components/Cart';
import { voiceAssistant } from '@/services/VoiceAssistant';
import { toast } from 'sonner';
import { ReceiptHistory } from '@/components/ReceiptHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, ReceiptText } from 'lucide-react';

interface POSViewProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export const POSView: React.FC<POSViewProps> = ({ products, setProducts }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>('pos');

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

  return (
    <div className="flex flex-col gap-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-52">
          <TabsTrigger value="pos" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" /> Sales
          </TabsTrigger>
          <TabsTrigger value="receipts" className="flex items-center gap-2">
            <ReceiptText className="h-4 w-4" /> Receipts
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pos" className="mt-4">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <ProductList products={products} onAddToCart={handleAddToCart} />
            </div>
            <div className="w-full lg:w-[30%]"> {/* Slightly narrower cart */}
              <Cart
                items={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="receipts" className="mt-4">
          <ReceiptHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

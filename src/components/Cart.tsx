
import React, { useEffect } from 'react';
import { CartItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { voiceAssistant } from '@/services/VoiceAssistant';
import { ShoppingCart, Trash, Plus, Minus, CreditCard } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
}

export const Cart: React.FC<CartProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  
  const totalItems = items.reduce(
    (count, item) => count + item.quantity,
    0
  );

  useEffect(() => {
    // When cart is first loaded
    const timer = setTimeout(() => {
      if (items.length === 0) {
        voiceAssistant.speakCartEmpty();
      }
    }, 2000); // Slight delay after page load
    
    return () => clearTimeout(timer);
  }, []);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    // First stop any current speech
    voiceAssistant.stopSpeaking();
    
    onUpdateQuantity(itemId, newQuantity);
    const item = items.find((i) => i.product.id === itemId);
    if (item) {
      // Voice assistant will be called with the calculated total in the Index page
    }
  };

  const handleRemoveItem = (itemId: string) => {
    // First stop any current speech
    voiceAssistant.stopSpeaking();
    
    const item = items.find((i) => i.product.id === itemId);
    onRemoveItem(itemId);
    // Voice assistant will be called with the calculated total in the Index page
  };

  const handleCheckout = () => {
    // First stop any current speech
    voiceAssistant.stopSpeaking();
    
    onCheckout();
    // Voice assistant will handle checkout speech in the Index page
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-indigo-50 dark:bg-indigo-950/20">
        <CardTitle className="flex items-center">
          <ShoppingCart className="mr-2 h-5 w-5" />
          Shopping Cart {totalItems > 0 && <span className="ml-1 text-sm font-normal">({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4 max-h-[50vh] overflow-auto">
          {items.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Your cart is empty
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex justify-between items-center p-3 border rounded-lg bg-gray-50 dark:bg-gray-900/30"
              >
                <div className="flex-1">
                  <h4 className="font-medium">{item.product.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ${item.product.price.toFixed(2)} each
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleQuantityChange(item.product.id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                    className="h-8 w-8"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleQuantityChange(item.product.id, item.quantity + 1)
                    }
                    className="h-8 w-8"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveItem(item.product.id)}
                    className="h-8 w-8 ml-1"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="p-4 flex flex-col">
        <div className="flex flex-col w-full gap-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax (10%):</span>
            <span>${(total * 0.1).toFixed(2)}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between font-semibold">
            <span>Total:</span>
            <span>${(total * 1.1).toFixed(2)}</span>
          </div>
          <Button
            className="mt-4 w-full bg-green-600 hover:bg-green-700"
            onClick={handleCheckout}
            disabled={items.length === 0}
          >
            <CreditCard className="mr-2 h-4 w-4" /> 
            Checkout
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

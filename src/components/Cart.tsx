import React, { useEffect } from 'react';
import { CartItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { voiceAssistant } from '@/services/VoiceAssistant';
import { ShoppingCart, Trash, Plus, Minus, CreditCard } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Receipt } from './Receipt';

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
    const timer = setTimeout(() => {
      if (items.length === 0) {
        voiceAssistant.speakCartEmpty();
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    voiceAssistant.stopSpeaking();
    
    onUpdateQuantity(itemId, newQuantity);
    const item = items.find((i) => i.product.id === itemId);
    if (item) {
    }
  };

  const handleRemoveItem = (itemId: string) => {
    voiceAssistant.stopSpeaking();
    
    const item = items.find((i) => i.product.id === itemId);
    onRemoveItem(itemId);
  };

  const handleCheckout = () => {
    voiceAssistant.stopSpeaking();
    
    onCheckout();
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-indigo-50 dark:bg-indigo-950/20 py-2">
        <CardTitle className="flex items-center text-base">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Cart {totalItems > 0 && <span className="ml-1 text-sm font-normal">({totalItems})</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="space-y-2 max-h-[40vh] overflow-auto">
          {items.length === 0 ? (
            <div className="text-center text-gray-500 py-4 text-sm">
              Your cart is empty
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex justify-between items-center p-2 border rounded-lg bg-gray-50 dark:bg-gray-900/30"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{item.product.name}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    ${item.product.price.toFixed(2)} each
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="h-6 w-6"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-6 text-center text-sm">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                    className="h-6 w-6"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveItem(item.product.id)}
                    className="h-6 w-6 ml-1"
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="p-2 flex flex-col">
        <div className="flex flex-col w-full gap-1">
          <div className="flex justify-between text-xs">
            <span>Subtotal:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>Tax (10%):</span>
            <span>${(total * 0.1).toFixed(2)}</span>
          </div>
          <Separator className="my-1" />
          <div className="flex justify-between text-sm font-semibold">
            <span>Total:</span>
            <span>${(total * 1.1).toFixed(2)}</span>
          </div>
          <Button
            className="mt-2 w-full bg-green-600 hover:bg-green-700"
            onClick={handleCheckout}
            disabled={items.length === 0}
            size="sm"
          >
            <CreditCard className="mr-2 h-4 w-4" /> 
            Checkout
          </Button>
          {items.length > 0 && (
            <Receipt 
              items={items} 
              total={total}
              onPrint={() => {
                voiceAssistant.speak('Receipt printed successfully');
              }}
            />
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

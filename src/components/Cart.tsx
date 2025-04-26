
import React from 'react';
import { CartItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { voiceAssistant } from '@/services/VoiceAssistant';

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

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    onUpdateQuantity(itemId, newQuantity);
    const item = items.find((i) => i.product.id === itemId);
    if (item) {
      voiceAssistant.speak(
        `Updated ${item.product.name} quantity to ${newQuantity}. Your cart total is now $${total.toFixed(2)}.`
      );
    }
  };

  const handleRemoveItem = (itemId: string) => {
    const item = items.find((i) => i.product.id === itemId);
    onRemoveItem(itemId);
    if (item) {
      voiceAssistant.speak(
        `Removed ${item.product.name} from your cart. Your cart total is now $${total.toFixed(2)}.`
      );
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Shopping Cart</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="flex justify-between items-center p-2 border-b"
            >
              <div>
                <h4 className="font-medium">{item.product.name}</h4>
                <p className="text-sm text-gray-600">
                  ${item.product.price.toFixed(2)} each
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleQuantityChange(item.product.id, item.quantity - 1)
                  }
                  disabled={item.quantity <= 1}
                >
                  -
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleQuantityChange(item.product.id, item.quantity + 1)
                  }
                >
                  +
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveItem(item.product.id)}
                >
                  ×
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-right">
          <p className="text-lg font-semibold">Total: ${total.toFixed(2)}</p>
          <Button
            className="mt-4 w-full bg-green-600 hover:bg-green-700"
            onClick={onCheckout}
            disabled={items.length === 0}
          >
            Checkout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

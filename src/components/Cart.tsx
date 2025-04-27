
import React, { useEffect, useState } from 'react';
import { CartItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { voiceAssistant } from '@/services/VoiceAssistant';
import { ShoppingCart, Trash, Plus, Minus, CreditCard } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Receipt } from './Receipt';
import { Input } from '@/components/ui/input';

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
  const [showPreview, setShowPreview] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    membership: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [orderNotes, setOrderNotes] = useState('');
  const [discount, setDiscount] = useState<{
    type: 'percentage' | 'fixed';
    value: number;
  }>({
    type: 'percentage',
    value: 0
  });

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

  const handleConfirm = () => {
    setShowPreview(true);
  };

  const handlePrintComplete = () => {
    setShowPreview(false);
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
        <div className="space-y-2">
          <div className="space-y-2">
            <Input
              placeholder="Customer Name"
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
              className="text-sm"
            />
            <Input
              placeholder="Phone"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
              className="text-sm"
            />
            <Input
              placeholder="Email"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
              className="text-sm"
            />
            <Input
              placeholder="Membership ID"
              value={customerInfo.membership}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, membership: e.target.value }))}
              className="text-sm"
            />
          </div>

          <Separator className="my-2" />
          
          <div className="max-h-[30vh] overflow-auto space-y-2">
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

          <Separator className="my-2" />

          <div className="space-y-2">
            <div className="flex gap-2">
              <select
                className="flex-1 text-sm rounded-md border p-2"
                value={discount.type}
                onChange={(e) => setDiscount(prev => ({ ...prev, type: e.target.value as 'percentage' | 'fixed' }))}
              >
                <option value="percentage">Percentage Discount</option>
                <option value="fixed">Fixed Discount</option>
              </select>
              <Input
                type="number"
                placeholder="Value"
                value={discount.value || ''}
                onChange={(e) => setDiscount(prev => ({ ...prev, value: Number(e.target.value) }))}
                className="w-24 text-sm"
              />
            </div>

            <select
              className="w-full text-sm rounded-md border p-2"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="mobile">Mobile Payment</option>
            </select>

            <textarea
              placeholder="Order Notes"
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              className="w-full text-sm rounded-md border p-2 min-h-[60px]"
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-2 flex flex-col">
        <div className="flex flex-col w-full gap-1">
          <div className="flex justify-between text-xs">
            <span>Subtotal:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          
          {discount.value > 0 && (
            <div className="flex justify-between text-xs text-green-600">
              <span>
                Discount ({discount.type === 'percentage' ? `${discount.value}%` : 'Fixed'}):
              </span>
              <span>
                -${(discount.type === 'percentage' ? (total * discount.value / 100) : discount.value).toFixed(2)}
              </span>
            </div>
          )}
          
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
            className="mt-2 w-full"
            onClick={handleConfirm}
            disabled={items.length === 0}
          >
            Confirm Order
          </Button>
        </div>
      </CardFooter>

      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <Receipt 
              items={items} 
              total={total}
              onPrint={handlePrintComplete}
              customerInfo={customerInfo}
              orderNotes={orderNotes}
              discount={discount.value > 0 ? discount : undefined}
              paymentMethod={paymentMethod}
            />
            <Button
              variant="outline"
              className="w-full mt-2"
              onClick={() => setShowPreview(false)}
            >
              Edit Order
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

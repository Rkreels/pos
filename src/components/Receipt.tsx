
import React from 'react';
import { CartItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

interface ReceiptProps {
  items: CartItem[];
  total: number;
  onPrint: () => void;
  customerInfo?: {
    name: string;
    phone?: string;
    email?: string;
    membership?: string;
  };
  orderNotes?: string;
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  paymentMethod?: string;
}

export const Receipt: React.FC<ReceiptProps> = ({ 
  items, 
  total, 
  onPrint,
  customerInfo,
  orderNotes,
  discount,
  paymentMethod
}) => {
  const printReceipt = async () => {
    try {
      const receiptContent = document.getElementById('receipt-content');
      if (!receiptContent) return;
      
      const printWindow = window.open('', '', 'width=300,height=600');
      if (!printWindow) return;

      printWindow.document.write(`
        <html>
          <head>
            <style>
              body { font-family: 'Courier New', monospace; font-size: 12px; width: 300px; }
              .header { text-align: center; margin-bottom: 10px; }
              .customer-info { margin: 10px 0; }
              .item { margin: 5px 0; }
              .total { margin-top: 10px; border-top: 1px dashed #000; padding-top: 5px; }
              .notes { margin-top: 10px; font-style: italic; }
              @media print {
                body { width: 80mm; } /* Standard thermal paper width */
              }
            </style>
          </head>
          <body>
            ${receiptContent.innerHTML}
          </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
      
      onPrint();
    } catch (error) {
      console.error('Printing failed:', error);
    }
  };

  const calculatedDiscount = discount 
    ? discount.type === 'percentage' 
      ? (total * (discount.value / 100))
      : discount.value
    : 0;

  const finalTotal = total - calculatedDiscount;

  return (
    <div>
      <div id="receipt-content" className="p-4 bg-white rounded-lg shadow">
        <div className="header">
          <h2 className="text-xl font-bold">SALES RECEIPT</h2>
          <p className="text-sm text-gray-600">{new Date().toLocaleString()}</p>
        </div>
        
        {customerInfo && (
          <div className="customer-info text-sm">
            <p><strong>Customer:</strong> {customerInfo.name}</p>
            {customerInfo.phone && <p><strong>Phone:</strong> {customerInfo.phone}</p>}
            {customerInfo.email && <p><strong>Email:</strong> {customerInfo.email}</p>}
            {customerInfo.membership && (
              <p><strong>Membership:</strong> {customerInfo.membership}</p>
            )}
          </div>
        )}

        <div className="items space-y-1">
          {items.map((item, index) => (
            <div key={index} className="item text-sm">
              <div className="flex justify-between">
                <span>{item.product.name} x {item.quantity}</span>
                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="total space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          
          {discount && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({discount.type === 'percentage' ? `${discount.value}%` : 'Fixed'}):</span>
              <span>-${calculatedDiscount.toFixed(2)}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span>Tax (10%):</span>
            <span>${(finalTotal * 0.1).toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>${(finalTotal * 1.1).toFixed(2)}</span>
          </div>

          {paymentMethod && (
            <div className="flex justify-between mt-2">
              <span>Payment Method:</span>
              <span>{paymentMethod}</span>
            </div>
          )}
        </div>

        {orderNotes && (
          <div className="notes mt-4 text-sm">
            <strong>Notes:</strong>
            <p>{orderNotes}</p>
          </div>
        )}

        <div className="footer text-center mt-4 text-sm">
          Thank you for your purchase!
        </div>
      </div>
      
      <Button 
        onClick={printReceipt}
        className="w-full mt-2"
        variant="outline"
      >
        <Printer className="mr-2 h-4 w-4" />
        Print Receipt
      </Button>
    </div>
  );
};

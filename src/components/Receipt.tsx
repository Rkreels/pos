
import React from 'react';
import { CartItem } from '@/types';
import { Button } from '@/components/ui/button';
import { printer } from 'lucide-react';

interface ReceiptProps {
  items: CartItem[];
  total: number;
  onPrint: () => void;
}

export const Receipt: React.FC<ReceiptProps> = ({ items, total, onPrint }) => {
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
              .item { margin: 5px 0; }
              .total { margin-top: 10px; border-top: 1px dashed #000; padding-top: 5px; }
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

  return (
    <div>
      <div id="receipt-content" className="hidden">
        <div className="header">
          <h2>SALES RECEIPT</h2>
          <p>{new Date().toLocaleString()}</p>
        </div>
        <div className="items">
          {items.map((item, index) => (
            <div key={index} className="item">
              <div>{item.product.name} x {item.quantity}</div>
              <div>${(item.product.price * item.quantity).toFixed(2)}</div>
            </div>
          ))}
        </div>
        <div className="total">
          <div>Subtotal: ${total.toFixed(2)}</div>
          <div>Tax (10%): ${(total * 0.1).toFixed(2)}</div>
          <div>Total: ${(total * 1.1).toFixed(2)}</div>
        </div>
        <div className="footer" style={{ textAlign: 'center', marginTop: '20px' }}>
          Thank you for your purchase!
        </div>
      </div>
      <Button 
        onClick={printReceipt}
        className="w-full mt-2"
        variant="outline"
      >
        <printer className="mr-2 h-4 w-4" />
        Print Receipt
      </Button>
    </div>
  );
};

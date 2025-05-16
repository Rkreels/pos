
import { CartItem } from '@/types';

export class ReceiptGenerator {
  static generatePrintableReceipt(
    items: CartItem[], 
    total: number, 
    tax: number, 
    paymentMethod: string,
    shopName: string
  ): void {
    const receiptWindow = window.open('', '_blank');
    if (!receiptWindow) {
      console.error('Could not open window for receipt');
      return;
    }
    
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    
    const receiptNumber = `R-${Date.now().toString().slice(-8)}`;
    
    const receiptHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt #${receiptNumber}</title>
        <style>
          body {
            font-family: 'Courier New', monospace;
            width: 300px;
            margin: 0 auto;
            padding: 10px;
          }
          .header, .footer {
            text-align: center;
            margin: 10px 0;
          }
          .divider {
            border-top: 1px dashed #000;
            margin: 10px 0;
          }
          .item {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
          }
          .item-name {
            width: 60%;
            overflow-wrap: break-word;
          }
          .item-qty {
            width: 10%;
            text-align: center;
          }
          .item-price {
            width: 30%;
            text-align: right;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
            font-weight: bold;
          }
          .thank-you {
            text-align: center;
            margin-top: 20px;
            font-style: italic;
          }
          @media print {
            body {
              width: 100%;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h3>${shopName}</h3>
          <p>Receipt #${receiptNumber}</p>
          <p>${date} ${time}</p>
        </div>
        
        <div class="divider"></div>
        
        ${items.map(item => `
          <div class="item">
            <div class="item-name">${item.product.name}</div>
            <div class="item-qty">${item.quantity}</div>
            <div class="item-price">$${(item.product.price * item.quantity).toFixed(2)}</div>
          </div>
        `).join('')}
        
        <div class="divider"></div>
        
        <div class="total-row">
          <div>Subtotal:</div>
          <div>$${(total - tax).toFixed(2)}</div>
        </div>
        
        <div class="total-row">
          <div>Tax:</div>
          <div>$${tax.toFixed(2)}</div>
        </div>
        
        <div class="total-row">
          <div>Total:</div>
          <div>$${total.toFixed(2)}</div>
        </div>
        
        <div class="divider"></div>
        
        <div class="payment">
          <p>Payment Method: ${paymentMethod}</p>
        </div>
        
        <div class="thank-you">
          Thank you for your purchase!
        </div>
        
        <div class="divider"></div>
        
        <div class="footer">
          <p>Return policy: Items can be returned within 30 days with receipt</p>
        </div>
        
        <div class="no-print">
          <button onclick="window.print()" style="display: block; margin: 20px auto;">Print Receipt</button>
        </div>
        
        <script>
          // Auto print
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;
    
    receiptWindow.document.open();
    receiptWindow.document.write(receiptHtml);
    receiptWindow.document.close();
  }
}


import React, { useState } from 'react';
import { Receipt } from './Receipt';
import { CartItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Receipt as ReceiptIcon, Clock, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface SavedReceipt {
  id: string;
  date: Date;
  items: CartItem[];
  total: number;
  customerInfo: {
    name: string;
    phone: string;
    email: string;
    membership: string;
  };
  paymentMethod: string;
  orderNotes: string;
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
  };
}

// Sample data for demonstration
const sampleReceipts: SavedReceipt[] = [
  {
    id: 'R1001',
    date: new Date(2023, 3, 15, 10, 30),
    items: [
      {
        product: {
          id: '1',
          name: 'Premium Coffee',
          price: 19.99,
          description: 'Freshly roasted arabica coffee beans',
          category: 'Beverages',
          sku: 'COF001',
          cost: 10.50
        },
        quantity: 2
      },
      {
        product: {
          id: '6',
          name: 'Water Bottle',
          price: 15.99,
          description: 'Insulated stainless steel water bottle',
          category: 'Accessories',
          sku: 'BOT006',
          cost: 5.75
        },
        quantity: 1
      }
    ],
    total: 55.97,
    customerInfo: {
      name: 'John Smith',
      phone: '555-123-4567',
      email: 'john@example.com',
      membership: 'GOLD123'
    },
    paymentMethod: 'card',
    orderNotes: 'Gift wrapped please'
  },
  {
    id: 'R1002',
    date: new Date(2023, 3, 15, 14, 45),
    items: [
      {
        product: {
          id: '3',
          name: 'Fitness Tracker',
          price: 59.99,
          description: 'Monitor your activities and health metrics',
          category: 'Electronics',
          sku: 'FIT003',
          cost: 25.00
        },
        quantity: 1
      }
    ],
    total: 59.99,
    customerInfo: {
      name: 'Mary Johnson',
      phone: '555-987-6543',
      email: 'mary@example.com',
      membership: ''
    },
    paymentMethod: 'cash',
    orderNotes: '',
    discount: {
      type: 'percentage',
      value: 10
    }
  },
  {
    id: 'R1003',
    date: new Date(2023, 3, 16, 9, 15),
    items: [
      {
        product: {
          id: '9',
          name: 'Mechanical Keyboard',
          price: 99.99,
          description: 'RGB backlit mechanical gaming keyboard',
          category: 'Electronics',
          sku: 'KEY009',
          cost: 45.50
        },
        quantity: 1
      },
      {
        product: {
          id: '5',
          name: 'Portable Charger',
          price: 39.99,
          description: '20,000mAh fast-charging power bank',
          category: 'Electronics',
          sku: 'CHR005',
          cost: 18.50
        },
        quantity: 2
      },
      {
        product: {
          id: '17',
          name: 'Phone Case',
          price: 19.99,
          description: 'Shock-absorbing phone case for iPhone 14',
          category: 'Electronics',
          sku: 'CSE017',
          cost: 5.50
        },
        quantity: 1
      }
    ],
    total: 199.96,
    customerInfo: {
      name: 'David Lee',
      phone: '555-555-1234',
      email: 'david@example.com',
      membership: 'PREM456'
    },
    paymentMethod: 'mobile',
    orderNotes: 'Customer will pick up tomorrow'
  }
];

export const ReceiptHistory: React.FC = () => {
  const [receipts, setReceipts] = useState<SavedReceipt[]>(sampleReceipts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<SavedReceipt | null>(null);
  const [showReceiptPreview, setShowReceiptPreview] = useState(false);

  const filteredReceipts = receipts.filter(receipt => 
    receipt.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receipt.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewReceipt = (receipt: SavedReceipt) => {
    setSelectedReceipt(receipt);
    setShowReceiptPreview(true);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString();
  };

  return (
    <div>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <ReceiptIcon className="mr-2 h-4 w-4" />
            Receipt History
          </CardTitle>
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search by customer name or receipt ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {filteredReceipts.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No receipts found</div>
            ) : (
              filteredReceipts.map((receipt) => (
                <div key={receipt.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm">{receipt.customerInfo.name || 'Walk-in Customer'}</h3>
                        <Badge variant="outline" className="text-xs">{receipt.id}</Badge>
                      </div>
                      <p className="text-xs text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" /> {formatDate(receipt.date)}
                      </p>
                      <p className="text-xs mt-1">
                        Items: {receipt.items.reduce((sum, item) => sum + item.quantity, 0)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${receipt.total.toFixed(2)}</p>
                      <Badge className="text-xs mt-1" variant="secondary">
                        {receipt.paymentMethod}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Drawer>
                      <DrawerTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleViewReceipt(receipt)}
                        >
                          <ReceiptIcon className="h-3 w-3 mr-1" /> View Receipt
                        </Button>
                      </DrawerTrigger>
                      <DrawerContent>
                        <div className="mx-auto w-full max-w-md p-6">
                          <Receipt 
                            items={receipt.items}
                            total={receipt.total}
                            onPrint={() => {}}
                            customerInfo={receipt.customerInfo}
                            orderNotes={receipt.orderNotes}
                            discount={receipt.discount}
                            paymentMethod={receipt.paymentMethod}
                          />
                        </div>
                      </DrawerContent>
                    </Drawer>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {showReceiptPreview && selectedReceipt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <Receipt 
              items={selectedReceipt.items}
              total={selectedReceipt.total}
              onPrint={() => setShowReceiptPreview(false)}
              customerInfo={selectedReceipt.customerInfo}
              orderNotes={selectedReceipt.orderNotes}
              discount={selectedReceipt.discount}
              paymentMethod={selectedReceipt.paymentMethod}
            />
            <Button
              variant="outline"
              className="w-full mt-2"
              onClick={() => setShowReceiptPreview(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

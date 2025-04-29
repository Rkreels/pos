
import React from 'react';
import { Customer, CustomerTransaction } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Phone, Edit, Download } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { voiceAssistant } from '@/services/VoiceAssistant';

// Sample customer transactions for demo
const sampleTransactions: CustomerTransaction[] = [
  {
    id: '1',
    date: new Date('2025-04-20'),
    total: 85.95,
    items: [
      { product: { id: '1', name: 'Premium Coffee', price: 19.99, description: 'Freshly ground beans' }, quantity: 2 },
      { product: { id: '5', name: 'Portable Charger', price: 45.97, description: 'High capacity power bank' }, quantity: 1 }
    ],
    paymentMethod: 'Credit Card'
  },
  {
    id: '2',
    date: new Date('2025-04-10'),
    total: 149.99,
    items: [
      { product: { id: '2', name: 'Wireless Earbuds', price: 149.99, description: 'Premium sound quality' }, quantity: 1 }
    ],
    paymentMethod: 'Cash'
  },
  {
    id: '3',
    date: new Date('2025-03-28'),
    total: 99.98,
    items: [
      { product: { id: '7', name: 'Bluetooth Speaker', price: 49.99, description: 'Portable wireless speaker' }, quantity: 2 }
    ],
    paymentMethod: 'Mobile Payment'
  }
];

interface CustomerDetailProps {
  customer: Customer;
  onBack: () => void;
  onEdit: (customer: Customer) => void;
}

export const CustomerDetail: React.FC<CustomerDetailProps> = ({ customer, onBack, onEdit }) => {
  const transactions = sampleTransactions;
  const lifetimeValue = transactions.reduce((sum, tx) => sum + tx.total, 0);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      voiceAssistant.speakCustomerHistory(customer.name);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [customer.name]);

  const handleExportHistory = () => {
    // In a real application, this would generate a CSV or PDF
    alert(`Exporting purchase history for ${customer.name}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Customers
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onEdit(customer)}>
            <Edit className="h-4 w-4 mr-2" /> Edit Customer
          </Button>
          <Button variant="outline" onClick={handleExportHistory}>
            <Download className="h-4 w-4 mr-2" /> Export History
          </Button>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-lg">{customer.name}</h3>
                {customer.loyaltyPoints ? (
                  <Badge className="mt-1">Loyalty Points: {customer.loyaltyPoints}</Badge>
                ) : null}
              </div>
              
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="text-gray-500">Email:</span>
                <div className="flex items-center gap-2">
                  <span>{customer.email}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" title="Send Email">
                    <Mail className="h-3.5 w-3.5" />
                  </Button>
                </div>
                
                {customer.phone && (
                  <>
                    <span className="text-gray-500">Phone:</span>
                    <div className="flex items-center gap-2">
                      <span>{customer.phone}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" title="Call Customer">
                        <Phone className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </>
                )}
                
                {customer.address && (
                  <>
                    <span className="text-gray-500">Address:</span>
                    <span>{customer.address}</span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Customer Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-semibold">{transactions.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Lifetime Value</p>
                <p className="text-2xl font-semibold">${lifetimeValue.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Latest Purchase</p>
                <p className="font-semibold">
                  {transactions.length > 0 
                    ? transactions.reduce((latest, tx) => 
                        latest.date > tx.date ? latest : tx, transactions[0]).date.toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Preferred Payment</p>
                <p className="font-semibold">
                  {transactions.length > 0 
                    ? transactions.reduce((acc, tx) => {
                        acc[tx.paymentMethod] = (acc[tx.paymentMethod] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Purchase History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                    No purchase history found
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>{tx.date.toLocaleDateString()}</TableCell>
                    <TableCell>
                      <ul className="list-disc list-inside">
                        {tx.items.map((item, i) => (
                          <li key={i}>{item.quantity}x {item.product.name}</li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell>{tx.paymentMethod}</TableCell>
                    <TableCell className="text-right">${tx.total.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

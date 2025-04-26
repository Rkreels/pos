
import React, { useEffect, useState } from 'react';
import { MainNavigation } from '@/components/MainNavigation';
import { Customer } from '@/types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, UserPlus, Mail, Phone } from 'lucide-react';
import { voiceAssistant } from '@/services/VoiceAssistant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

// Sample customers data
const sampleCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '555-123-4567',
    address: '123 Main St, Anytown, CA',
    loyaltyPoints: 250
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '555-987-6543',
    address: '456 Oak Ave, Somewhere, NY',
    loyaltyPoints: 180
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    phone: '555-567-8901',
    address: '789 Pine Rd, Nowhere, TX',
    loyaltyPoints: 320
  },
  {
    id: '4',
    name: 'Alice Williams',
    email: 'alice.williams@example.com',
    phone: '555-345-6789',
    address: '101 Elm Blvd, Anywhere, FL',
    loyaltyPoints: 450
  },
  {
    id: '5',
    name: 'Charles Brown',
    email: 'charles.brown@example.com',
    phone: '555-234-5678',
    address: '202 Maple Dr, Everywhere, WA',
    loyaltyPoints: 120
  }
];

const CustomersPage: React.FC = () => {
  const [customers] = useState<Customer[]>(sampleCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.phone && customer.phone.includes(searchTerm))
  );
  
  useEffect(() => {
    // Speak page overview when the page loads
    const timer = setTimeout(() => {
      voiceAssistant.speakCustomersPage();
    }, 500);
    
    return () => {
      clearTimeout(timer);
      voiceAssistant.stopSpeaking();
    };
  }, []);

  const handleAddCustomer = () => {
    toast.info("Add customer functionality will be implemented in a future update");
  };
  
  const handleContactCustomer = (method: 'email' | 'phone', customer: Customer) => {
    if (method === 'email') {
      toast.info(`Sending email to ${customer.name} at ${customer.email}`);
    } else {
      toast.info(`Calling ${customer.name} at ${customer.phone}`);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <MainNavigation />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm py-4 px-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Customer Management</h1>
            <Button onClick={handleAddCustomer}>
              <UserPlus className="h-4 w-4 mr-2" /> Add Customer
            </Button>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <Card className="flex-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{customers.length}</div>
                </CardContent>
              </Card>
              
              <Card className="flex-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Loyalty Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{customers.filter(c => (c.loyaltyPoints || 0) > 0).length}</div>
                </CardContent>
              </Card>
              
              <Card className="flex-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Average Loyalty Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(
                      customers.reduce((sum, customer) => sum + (customer.loyaltyPoints || 0), 0) / 
                      customers.length
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead className="text-right">Loyalty Points</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                        No customers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.phone || 'N/A'}</TableCell>
                        <TableCell className="max-w-xs truncate">{customer.address || 'N/A'}</TableCell>
                        <TableCell className="text-right">{customer.loyaltyPoints || 0}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleContactCustomer('email', customer)}
                              title="Send Email"
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                            {customer.phone && (
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => handleContactCustomer('phone', customer)}
                                title="Call Customer"
                              >
                                <Phone className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomersPage;

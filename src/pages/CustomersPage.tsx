
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
import { Search, UserPlus, Mail, Phone, Eye, Edit, Trash } from 'lucide-react';
import { voiceAssistant } from '@/services/VoiceAssistant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CustomerDetail } from '@/components/CustomerDetail';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [customers, setCustomers] = useState<Customer[]>(sampleCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerDetailView, setCustomerDetailView] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    loyaltyPoints: 0
  });
  
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
    setEditingCustomer(null);
    setNewCustomer({
      name: '',
      email: '',
      phone: '',
      address: '',
      loyaltyPoints: 0
    });
    setIsDialogOpen(true);
    voiceAssistant.speakAddCustomer();
  };
  
  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setNewCustomer({ ...customer });
    setIsDialogOpen(true);
    voiceAssistant.speakEditCustomer();
  };
  
  const handleSaveCustomer = () => {
    if (!newCustomer.name || !newCustomer.email) {
      toast.error('Name and email are required');
      return;
    }

    if (editingCustomer) {
      setCustomers(prevCustomers => 
        prevCustomers.map(c => 
          c.id === editingCustomer.id
            ? { ...c, ...newCustomer } as Customer
            : c
        )
      );
      toast.success(`Updated customer: ${newCustomer.name}`);
      // If we're editing the selected customer, update that as well
      if (selectedCustomer && selectedCustomer.id === editingCustomer.id) {
        setSelectedCustomer({ ...selectedCustomer, ...newCustomer } as Customer);
      }
    } else {
      const customerToAdd = {
        ...newCustomer,
        id: `${Date.now()}`, // Simple ID generation
      } as Customer;
      
      setCustomers(prevCustomers => [...prevCustomers, customerToAdd]);
      toast.success(`Added customer: ${newCustomer.name}`);
    }
    
    setIsDialogOpen(false);
  };
  
  const handleDeleteCustomer = () => {
    if (selectedCustomer) {
      setCustomers(prevCustomers => prevCustomers.filter(c => c.id !== selectedCustomer.id));
      toast.success(`Deleted customer: ${selectedCustomer.name}`);
      setIsDeleteDialogOpen(false);
      setSelectedCustomer(null);
      setCustomerDetailView(false);
    }
  };
  
  const confirmDeleteCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDeleteDialogOpen(true);
  };
  
  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerDetailView(true);
  };
  
  const handleContactCustomer = (method: 'email' | 'phone', customer: Customer) => {
    if (method === 'email') {
      toast.info(`Sending email to ${customer.name} at ${customer.email}`);
    } else {
      toast.info(`Calling ${customer.name} at ${customer.phone}`);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <MainNavigation />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card shadow-sm py-4 px-4 md:px-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-start sm:items-center">
            <h1 className="text-xl md:text-2xl font-bold text-foreground">
              {customerDetailView && selectedCustomer ? `Customer: ${selectedCustomer.name}` : 'Customer Management'}
            </h1>
            {!customerDetailView && (
              <Button onClick={handleAddCustomer} className="w-full sm:w-auto">
                <UserPlus className="h-4 w-4 mr-2" /> Add Customer
              </Button>
            )}
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          {customerDetailView && selectedCustomer ? (
            <CustomerDetail 
              customer={selectedCustomer} 
              onBack={() => setCustomerDetailView(false)}
              onEdit={handleEditCustomer}
            />
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
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
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[120px]">Name</TableHead>
                        <TableHead className="hidden sm:table-cell min-w-[200px]">Email</TableHead>
                        <TableHead className="hidden md:table-cell">Phone</TableHead>
                        <TableHead className="hidden lg:table-cell">Address</TableHead>
                        <TableHead className="text-right">Loyalty Points</TableHead>
                        <TableHead className="text-right min-w-[200px]">Actions</TableHead>
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
                          <TableCell className="hidden sm:table-cell">{customer.email}</TableCell>
                          <TableCell className="hidden md:table-cell">{customer.phone || 'N/A'}</TableCell>
                          <TableCell className="hidden lg:table-cell max-w-xs truncate">{customer.address || 'N/A'}</TableCell>
                          <TableCell className="text-right">{customer.loyaltyPoints || 0}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1 flex-wrap">
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => handleViewCustomer(customer)}
                                title="View Customer"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => handleEditCustomer(customer)}
                                title="Edit Customer"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
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
                              <Button 
                                variant="destructive" 
                                size="icon"
                                onClick={() => confirmDeleteCustomer(customer)}
                                title="Delete Customer"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
          
          {/* Add/Edit Customer Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input
                    id="name"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">Phone</Label>
                  <Input
                    id="phone"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="loyaltyPoints" className="text-right">Loyalty Points</Label>
                  <Input
                    id="loyaltyPoints"
                    type="number"
                    value={newCustomer.loyaltyPoints}
                    onChange={(e) => setNewCustomer({
                      ...newCustomer, 
                      loyaltyPoints: parseInt(e.target.value) || 0
                    })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="address" className="text-right">Address</Label>
                  <Textarea
                    id="address"
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                    className="col-span-3"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleSaveCustomer}>
                  {editingCustomer ? 'Update' : 'Add'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Delete Confirmation Dialog */}
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Customer</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete {selectedCustomer?.name}? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteCustomer}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </main>
      </div>
    </div>
  );
};

export default CustomersPage;

import React, { useEffect, useState } from 'react';
import { MainNavigation } from '@/components/MainNavigation';
import { Supplier } from '@/types';
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
import { Search, UserPlus, Mail, Phone, Truck, Plus } from 'lucide-react';
import { voiceAssistant } from '@/services/VoiceAssistant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supplierData } from '@/data/suppliers';
import { productData } from '@/data/products';

const SuppliersPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(supplierData);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [newSupplier, setNewSupplier] = useState<Partial<Supplier>>({
    name: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    products: []
  });
  
  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (supplier.phone && supplier.phone.includes(searchTerm))
  );
  
  useEffect(() => {
    const timer = setTimeout(() => {
      voiceAssistant.speakSupplierManagement();
    }, 500);
    
    return () => {
      clearTimeout(timer);
      voiceAssistant.stopSpeaking();
    };
  }, []);

  const handleAddSupplier = () => {
    setEditingSupplier(null);
    setNewSupplier({
      name: '',
      contactName: '',
      email: '',
      phone: '',
      address: '',
      products: []
    });
    setIsDialogOpen(true);
  };
  
  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setNewSupplier({ ...supplier });
    setIsDialogOpen(true);
  };
  
  const handleSaveSupplier = () => {
    if (!newSupplier.name) {
      toast.error('Supplier name is required');
      return;
    }

    if (editingSupplier) {
      setSuppliers(prevSuppliers => 
        prevSuppliers.map(s => 
          s.id === editingSupplier.id
            ? { ...s, ...newSupplier } as Supplier
            : s
        )
      );
      toast.success(`Updated supplier: ${newSupplier.name}`);
    } else {
      const supplierToAdd = {
        ...newSupplier,
        id: `${Date.now()}`, // Simple ID generation
      } as Supplier;
      
      setSuppliers(prevSuppliers => [...prevSuppliers, supplierToAdd]);
      toast.success(`Added supplier: ${newSupplier.name}`);
    }
    
    setIsDialogOpen(false);
  };
  
  const handleDeleteSupplier = (supplierId: string) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    if (supplier) {
      setSuppliers(prevSuppliers => prevSuppliers.filter(s => s.id !== supplierId));
      toast.success(`Deleted supplier: ${supplier.name}`);
    }
  };
  
  const handleContactSupplier = (method: 'email' | 'phone', supplier: Supplier) => {
    if (method === 'email' && supplier.email) {
      toast.info(`Sending email to ${supplier.name} at ${supplier.email}`);
    } else if (method === 'phone' && supplier.phone) {
      toast.info(`Calling ${supplier.name} at ${supplier.phone}`);
    }
  };

  // Get product names for supplier's products
  const getProductNamesForSupplier = (products: ProductReference[] = []) => {
    return products.map(product => product.name).join(', ');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <MainNavigation />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm py-4 px-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Supplier Management</h1>
            <Button onClick={handleAddSupplier}>
              <Plus className="h-4 w-4 mr-2" /> Add Supplier
            </Button>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <Card className="flex-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{suppliers.length}</div>
                </CardContent>
              </Card>
              
              <Card className="flex-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {suppliers.reduce((total, supplier) => total + (supplier.products?.length || 0), 0)}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search suppliers..."
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
                    <TableHead>Supplier Name</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuppliers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                        No suppliers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSuppliers.map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell className="font-medium">{supplier.name}</TableCell>
                        <TableCell>{supplier.contactName || 'N/A'}</TableCell>
                        <TableCell>{supplier.email || 'N/A'}</TableCell>
                        <TableCell>{supplier.phone || 'N/A'}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {getProductNamesForSupplier(supplier.products)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleContactSupplier('email', supplier)}
                              disabled={!supplier.email}
                              title="Send Email"
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleContactSupplier('phone', supplier)}
                              disabled={!supplier.phone}
                              title="Call Supplier"
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEditSupplier(supplier)}
                              title="Edit Supplier"
                            >
                              <Truck className="h-4 w-4" />
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
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Supplier Name</Label>
                  <Input
                    id="name"
                    value={newSupplier.name}
                    onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contactName" className="text-right">Contact Person</Label>
                  <Input
                    id="contactName"
                    value={newSupplier.contactName}
                    onChange={(e) => setNewSupplier({...newSupplier, contactName: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newSupplier.email}
                    onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">Phone</Label>
                  <Input
                    id="phone"
                    value={newSupplier.phone}
                    onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="address" className="text-right">Address</Label>
                  <Textarea
                    id="address"
                    value={newSupplier.address}
                    onChange={(e) => setNewSupplier({...newSupplier, address: e.target.value})}
                    className="col-span-3"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveSupplier}>
                  {editingSupplier ? 'Update' : 'Add'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default SuppliersPage;

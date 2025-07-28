import React, { useState } from 'react';
import { MainNavigation } from '@/components/MainNavigation';
import { useShop } from '@/context/ShopContext';
import { Shop } from '@/types';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
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
import { Search, Plus, Edit, Trash, Store } from 'lucide-react';
import { toast } from 'sonner';
import { voiceAssistant } from '@/services/VoiceAssistant';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const ShopsPage: React.FC = () => {
  const { shops, refreshShops, currentShop, setCurrentShop } = useShop();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newShop, setNewShop] = useState<Partial<Shop>>({
    name: '',
    address: '',
    phone: '',
    email: '',
    status: 'active',
    ownerId: '1' // Default owner ID
  });
  
  const filteredShops = shops.filter(shop => 
    shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (shop.email && shop.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  React.useEffect(() => {
    // Speak page overview when the page loads
    const timer = setTimeout(() => {
      voiceAssistant.speakShopManagement();
    }, 500);
    
    return () => {
      clearTimeout(timer);
      voiceAssistant.stopSpeaking();
    };
  }, []);

  const handleAddShop = () => {
    setSelectedShop(null);
    setNewShop({
      name: '',
      address: '',
      phone: '',
      email: '',
      status: 'active',
      ownerId: '1'
    });
    setIsDialogOpen(true);
  };
  
  const handleEditShop = (shop: Shop) => {
    setSelectedShop(shop);
    setNewShop({ ...shop });
    setIsDialogOpen(true);
  };
  
  const handleSaveShop = async () => {
    if (!newShop.name || !newShop.address) {
      toast.error('Name and address are required');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (selectedShop) {
        // Update existing shop
        refreshShops();
        toast.success(`Updated shop: ${newShop.name}`);
        
        // Update current shop if it's the one being edited
        if (currentShop && currentShop.id === selectedShop.id) {
          setCurrentShop({ ...currentShop, ...newShop } as Shop);
        }
      } else {
        // Add new shop
        refreshShops();
        toast.success(`Added shop: ${newShop.name}`);
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Failed to save shop. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteShop = async () => {
    if (selectedShop) {
      setIsLoading(true);
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        refreshShops();
        toast.success(`Deleted shop: ${selectedShop.name}`);
        
        // If we're deleting the current shop, set another one as current
        if (currentShop && currentShop.id === selectedShop.id) {
          const remainingShops = shops.filter(shop => shop.id !== selectedShop.id);
          if (remainingShops.length > 0) {
            setCurrentShop(remainingShops[0]);
          } else {
            setCurrentShop(null);
          }
        }
      } catch (error) {
        toast.error('Failed to delete shop. Please try again.');
      } finally {
        setIsLoading(false);
        setIsDeleteDialogOpen(false);
        setSelectedShop(null);
      }
    }
  };
  
  const confirmDeleteShop = (shop: Shop) => {
    setSelectedShop(shop);
    setIsDeleteDialogOpen(true);
  };
  
  const handleSelectShop = (shop: Shop) => {
    setCurrentShop(shop);
    toast.success(`Switched to shop: ${shop.name}`);
  };

  return (
    <div className="flex h-screen bg-background">
      <MainNavigation />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card shadow-sm py-4 px-4 md:px-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-start sm:items-center">
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Shop Management</h1>
            <Button onClick={handleAddShop} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" /> Add Shop
            </Button>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <Card className="flex-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Shops</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{shops.length}</div>
                </CardContent>
              </Card>
              
              <Card className="flex-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Shops</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{shops.filter(shop => shop.status === 'active').length}</div>
                </CardContent>
              </Card>
              
              <Card className="flex-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Current Shop</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold flex items-center">
                    <Store className="h-4 w-4 mr-2" />
                    {currentShop ? currentShop.name : "None selected"}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search shops..."
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
                    <TableHead>Address</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredShops.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                        No shops found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredShops.map((shop) => (
                      <TableRow 
                        key={shop.id} 
                        className={cn(
                          currentShop?.id === shop.id ? "bg-blue-50" : ""
                        )}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <Store className="h-4 w-4 mr-2" />
                            {shop.name}
                            {currentShop?.id === shop.id && (
                              <Badge variant="outline" className="ml-2">Current</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{shop.address}</TableCell>
                        <TableCell>
                          {shop.email && <div>{shop.email}</div>}
                          {shop.phone && <div>{shop.phone}</div>}
                        </TableCell>
                        <TableCell>
                          <Badge variant={shop.status === 'active' ? 'default' : 'secondary'}>
                            {shop.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleSelectShop(shop)}
                              disabled={currentShop?.id === shop.id}
                            >
                              Select
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleEditShop(shop)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="icon"
                              onClick={() => confirmDeleteShop(shop)}
                              disabled={shops.length <= 1} // Prevent deleting last shop
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
          
          {/* Add/Edit Shop Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{selectedShop ? 'Edit Shop' : 'Add New Shop'}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input
                    id="name"
                    value={newShop.name}
                    onChange={(e) => setNewShop({...newShop, name: e.target.value})}
                    className="col-span-3"
                    placeholder="Shop name"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">Address</Label>
                  <Input
                    id="address"
                    value={newShop.address}
                    onChange={(e) => setNewShop({...newShop, address: e.target.value})}
                    className="col-span-3"
                    placeholder="Full address"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newShop.email}
                    onChange={(e) => setNewShop({...newShop, email: e.target.value})}
                    className="col-span-3"
                    placeholder="Contact email"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">Phone</Label>
                  <Input
                    id="phone"
                    value={newShop.phone}
                    onChange={(e) => setNewShop({...newShop, phone: e.target.value})}
                    className="col-span-3"
                    placeholder="Contact phone number"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">Status</Label>
                  <select
                    id="status"
                    value={newShop.status}
                    onChange={(e) => setNewShop({
                      ...newShop, 
                      status: e.target.value as 'active' | 'inactive'
                    })}
                    className="col-span-3 p-2 border rounded"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  onClick={handleSaveShop}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    selectedShop ? 'Update' : 'Add'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Delete Confirmation Dialog */}
          <ConfirmDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={handleDeleteShop}
            title="Delete Shop"
            description={`Are you sure you want to delete ${selectedShop?.name}? This action cannot be undone.`}
            confirmText="Delete"
            variant="destructive"
          />
        </main>
      </div>
    </div>
  );
};

export default ShopsPage;


import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Store, User, Users, DollarSign, ShoppingCart } from 'lucide-react';

// Sample data for comparison between shops
const shopComparisonData = [
  { name: 'Main Store', sales: 12000, customers: 245, orders: 189 },
  { name: 'Downtown Branch', sales: 8500, customers: 180, orders: 120 },
  { name: 'Mall Kiosk', sales: 5200, customers: 95, orders: 78 },
];

interface MasterManagerDashboardProps {
  userId: string;
  managedShopIds: string[];
}

const MasterManagerDashboard: React.FC<MasterManagerDashboardProps> = ({ 
  userId, 
  managedShopIds 
}) => {
  const { shops } = useShop();
  const [activeMetric, setActiveMetric] = useState<'sales' | 'customers' | 'orders'>('sales');
  
  // Filter shops to only show those managed by this master manager
  const managedShops = shops.filter(shop => managedShopIds.includes(shop.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Master Manager Dashboard</h2>
        <Badge variant="outline" className="px-3 py-1">
          <Store className="h-4 w-4 mr-2" />
          Managing {managedShops.length} Shops
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Combined Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$25,700</div>
            <p className="text-xs text-gray-500">Across all managed shops</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">520</div>
            <p className="text-xs text-gray-500">Across all managed shops</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">387</div>
            <p className="text-xs text-gray-500">Across all managed shops</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Shop Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="sales" 
            className="space-y-4"
            onValueChange={(value) => setActiveMetric(value as 'sales' | 'customers' | 'orders')}
          >
            <TabsList>
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>
            <TabsContent value="sales" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={shopComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#8884d8" name="Sales ($)" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="customers" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={shopComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="customers" fill="#82ca9d" name="Customers" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="orders" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={shopComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="orders" fill="#ffc658" name="Orders" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Managed Shops</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shop Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Contact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {managedShops.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                    No shops assigned to manage
                  </TableCell>
                </TableRow>
              ) : (
                managedShops.map(shop => (
                  <TableRow key={shop.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Store className="h-4 w-4 mr-2" />
                        {shop.name}
                      </div>
                    </TableCell>
                    <TableCell>{shop.address}</TableCell>
                    <TableCell>
                      <Badge variant={shop.status === 'active' ? 'default' : 'secondary'}>
                        {shop.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{shop.phone || shop.email || 'No contact info'}</TableCell>
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

export default MasterManagerDashboard;

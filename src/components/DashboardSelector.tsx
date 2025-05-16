
import React from 'react';
import { User } from '@/types';
import { Dashboard } from '@/components/Dashboard';
import MasterManagerDashboard from '@/components/MasterManagerDashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Store } from 'lucide-react';
import { SalesData } from '@/types';

interface DashboardSelectorProps {
  currentUser: User;
  currentShop: any;
  products: any[];
  sampleSalesData: SalesData[];
  sampleTopSellingProducts: any[];
  sampleRecentActivity: any[];
}

export const DashboardSelector: React.FC<DashboardSelectorProps> = ({
  currentUser,
  currentShop,
  products,
  sampleSalesData,
  sampleTopSellingProducts,
  sampleRecentActivity
}) => {
  // Determine whether to show master dashboard or regular dashboard
  const showMasterDashboard = currentUser.role === 'master' && currentUser.managedShops && currentUser.managedShops.length > 0;

  if (showMasterDashboard) {
    return (
      <MasterManagerDashboard 
        userId={currentUser.id} 
        managedShopIds={currentUser.managedShops || []} 
      />
    );
  }

  if (!currentShop) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Store className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">No Shop Selected</h2>
        <p className="text-gray-500 mb-4">Please select a shop from the sidebar to view dashboard data.</p>
        <p className="text-gray-500">You can manage your shops by going to the Shops page.</p>
      </div>
    );
  }

  // Regular dashboard with different data based on role
  let salesModifier = 1.0;
  let ordersModifier = 1.0;

  // Show different data based on role (simulating different access levels)
  switch (currentUser.role) {
    case 'admin':
      // Admin sees everything, full data
      salesModifier = 1.0;
      ordersModifier = 1.0;
      break;
    case 'manager':
      // Managers see only their shop data (simulated as 60% of total)
      salesModifier = 0.6;
      ordersModifier = 0.7;
      break;
    case 'cashier':
      // Cashiers see limited data (simulated as 30% of total)
      salesModifier = 0.3;
      ordersModifier = 0.4;
      break;
    default:
      salesModifier = 1.0;
      ordersModifier = 1.0;
  }

  const adjustedSalesData = sampleSalesData.map(item => ({
    ...item,
    sales: Math.round(item.sales * salesModifier),
    transactions: Math.round(item.transactions * ordersModifier)
  }));

  return (
    <Dashboard 
      totalSales={Math.round(12458.99 * salesModifier)}
      totalOrders={Math.round(142 * ordersModifier)}
      totalCustomers={Math.round(64 * (currentUser.role === 'cashier' ? 0.5 : 1.0))}
      totalProducts={products.length}
      salesData={adjustedSalesData}
      topSellingProducts={sampleTopSellingProducts}
      recentActivity={sampleRecentActivity}
    />
  );
};

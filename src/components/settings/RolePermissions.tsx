
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { rbac } from '@/services/RoleBasedAccessControl';
import { UserPermissions } from '@/types';

export const RolePermissions: React.FC = () => {
  const [activeRole, setActiveRole] = useState<'admin' | 'master' | 'manager' | 'cashier'>('admin');
  const [permissions, setPermissions] = useState<UserPermissions>(rbac.getDefaultPermissions('admin'));

  // Load default permissions for the selected role
  useEffect(() => {
    setPermissions(rbac.getDefaultPermissions(activeRole));
  }, [activeRole]);

  // Handle permission toggle
  const handlePermissionToggle = (
    module: keyof UserPermissions, 
    action: string, 
    value: boolean
  ) => {
    setPermissions(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [action]: value
      }
    }));
  };

  // Save permission changes
  const handleSavePermissions = () => {
    // In a real app, this would update permissions in the database
    toast.success(`Permissions updated for ${activeRole} role`);
  };

  // Create permission switch with label
  const PermissionSwitch = ({ 
    module, 
    action, 
    label 
  }: { 
    module: keyof UserPermissions, 
    action: string, 
    label: string 
  }) => {
    return (
      <div className="flex items-center justify-between py-2">
        <Label htmlFor={`${module}-${action}`} className="flex-1">{label}</Label>
        <Switch 
          id={`${module}-${action}`} 
          checked={permissions[module][action as keyof typeof permissions[module]]} 
          onCheckedChange={(checked) => handlePermissionToggle(module, action, checked)}
          disabled={activeRole === 'admin' && action === 'view'} // Admin always has view permission
        />
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role Permissions</CardTitle>
        <CardDescription>Configure access permissions for each role in the system</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeRole} onValueChange={(value) => setActiveRole(value as typeof activeRole)}>
          <TabsList className="mb-4">
            <TabsTrigger value="admin">Admin</TabsTrigger>
            <TabsTrigger value="master">Master Manager</TabsTrigger>
            <TabsTrigger value="manager">Manager</TabsTrigger>
            <TabsTrigger value="cashier">Cashier</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeRole} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Point of Sale Permissions */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center">
                  <ShoppingCartIcon className="w-5 h-5 mr-2" /> Point of Sale
                </h3>
                <PermissionSwitch module="pos" action="access" label="Access POS" />
                <PermissionSwitch module="pos" action="applyDiscounts" label="Apply Discounts" />
                <PermissionSwitch module="pos" action="voidTransactions" label="Void Transactions" />
                <Separator />
              </div>
              
              {/* Inventory Permissions */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center">
                  <PackageIcon className="w-5 h-5 mr-2" /> Inventory
                </h3>
                <PermissionSwitch module="inventory" action="view" label="View Inventory" />
                <PermissionSwitch module="inventory" action="edit" label="Edit Products" />
                <PermissionSwitch module="inventory" action="delete" label="Delete Products" />
                <Separator />
              </div>
              
              {/* Customer Permissions */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center">
                  <UsersIcon className="w-5 h-5 mr-2" /> Customers
                </h3>
                <PermissionSwitch module="customers" action="view" label="View Customers" />
                <PermissionSwitch module="customers" action="edit" label="Edit Customers" />
                <PermissionSwitch module="customers" action="delete" label="Delete Customers" />
                <Separator />
              </div>
              
              {/* Reports Permissions */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center">
                  <BarChartIcon className="w-5 h-5 mr-2" /> Reports
                </h3>
                <PermissionSwitch module="reports" action="view" label="View Reports" />
                <PermissionSwitch module="reports" action="export" label="Export Reports" />
                <Separator />
              </div>
              
              {/* Suppliers Permissions */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center">
                  <TruckIcon className="w-5 h-5 mr-2" /> Suppliers
                </h3>
                <PermissionSwitch module="suppliers" action="view" label="View Suppliers" />
                <PermissionSwitch module="suppliers" action="create" label="Add Suppliers" />
                <PermissionSwitch module="suppliers" action="edit" label="Edit Suppliers" />
                <PermissionSwitch module="suppliers" action="delete" label="Delete Suppliers" />
                <Separator />
              </div>
              
              {/* User Management Permissions */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center">
                  <UserIcon className="w-5 h-5 mr-2" /> Users
                </h3>
                <PermissionSwitch module="users" action="view" label="View Users" />
                <PermissionSwitch module="users" action="create" label="Add Users" />
                <PermissionSwitch module="users" action="edit" label="Edit Users" />
                <PermissionSwitch module="users" action="delete" label="Delete Users" />
                <Separator />
              </div>
              
              {/* Shop Management Permissions */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center">
                  <BuildingIcon className="w-5 h-5 mr-2" /> Shops
                </h3>
                <PermissionSwitch module="shops" action="view" label="View Shops" />
                <PermissionSwitch module="shops" action="create" label="Add Shops" />
                <PermissionSwitch module="shops" action="edit" label="Edit Shops" />
                <PermissionSwitch module="shops" action="delete" label="Delete Shops" />
              </div>
              
              {/* Settings Permissions */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center">
                  <SettingsIcon className="w-5 h-5 mr-2" /> Settings
                </h3>
                <PermissionSwitch module="settings" action="view" label="View Settings" />
                <PermissionSwitch module="settings" action="edit" label="Edit Settings" />
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button onClick={handleSavePermissions}>
                Save {activeRole.charAt(0).toUpperCase() + activeRole.slice(1)} Permissions
              </Button>
            </div>
            
            {activeRole === 'admin' && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm">
                <strong>Note:</strong> Admin users always have view access to all areas of the system and cannot have this permission removed.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Icons for sections
const ShoppingCartIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="8" cy="21" r="1"></circle>
    <circle cx="19" cy="21" r="1"></circle>
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
  </svg>
);

const PackageIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12.89 1.45 8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.79 0l-8-4a2 2 0 0 1-1.1-1.8V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.78 0Z"></path>
    <path d="M2.32 6.16 12 11l9.68-4.84"></path>
    <path d="M12 22.76V11"></path>
    <path d="M7 3.5v4"></path>
    <path d="M17 3.5v4"></path>
  </svg>
);

const UsersIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const BarChartIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 20V10"></path>
    <path d="M18 20V4"></path>
    <path d="M6 20v-4"></path>
  </svg>
);

const TruckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10 17h4V6a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v11Z"></path>
    <path d="M2 17h8V6a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v11Z"></path>
    <path d="M14 17h8v-7a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v7Z"></path>
    <path d="M2 17h20"></path>
    <path d="M22 17v4"></path>
    <path d="M2 17v4"></path>
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const BuildingIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2"></rect>
    <path d="M9 22v-4h6v4"></path>
    <path d="M8 6h.01"></path>
    <path d="M16 6h.01"></path>
    <path d="M12 6h.01"></path>
    <path d="M12 10h.01"></path>
    <path d="M12 14h.01"></path>
    <path d="M16 10h.01"></path>
    <path d="M16 14h.01"></path>
    <path d="M8 10h.01"></path>
    <path d="M8 14h.01"></path>
  </svg>
);

const SettingsIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
  </svg>
);

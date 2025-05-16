
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { rbac } from '@/services/RoleBasedAccessControl';
import { UserPermissions } from '@/types';
import { PermissionGroup } from './permissions/PermissionGroup';
import { 
  ShoppingBag, Package, Users, BarChart, Truck, 
  User, Building, Settings as SettingsIcon
} from 'lucide-react';

export const RolePermissions: React.FC = () => {
  const [activeRole, setActiveRole] = useState<'admin' | 'master' | 'manager' | 'cashier'>('admin');
  const [permissions, setPermissions] = useState<UserPermissions>(rbac.getUserPermissions({ role: activeRole } as any));

  // Load default permissions for the selected role
  useEffect(() => {
    setPermissions(rbac.getUserPermissions({ role: activeRole } as any));
  }, [activeRole]);

  // Handle permission toggle
  const handlePermissionToggle = (
    module: keyof UserPermissions, 
    action: string, 
    value: boolean
  ) => {
    setPermissions(prev => {
      const newPermissions = { ...prev };
      if (newPermissions[module]) {
        (newPermissions[module] as any)[action] = value;
      }
      return newPermissions;
    });
  };

  // Save permission changes
  const handleSavePermissions = () => {
    // In a real app, this would update permissions in the database
    toast.success(`Permissions updated for ${activeRole} role`);
  };

  // Permission group definitions
  const permissionGroups = [
    {
      title: "Point of Sale",
      icon: ShoppingBag,
      module: "pos" as keyof UserPermissions,
      actions: [
        { key: "access", label: "Access POS" },
        { key: "applyDiscounts", label: "Apply Discounts" },
        { key: "voidTransactions", label: "Void Transactions" }
      ]
    },
    {
      title: "Inventory",
      icon: Package,
      module: "inventory" as keyof UserPermissions,
      actions: [
        { key: "view", label: "View Inventory" },
        { key: "edit", label: "Edit Products" },
        { key: "delete", label: "Delete Products" }
      ]
    },
    {
      title: "Customers",
      icon: Users,
      module: "customers" as keyof UserPermissions,
      actions: [
        { key: "view", label: "View Customers" },
        { key: "edit", label: "Edit Customers" },
        { key: "delete", label: "Delete Customers" }
      ]
    },
    {
      title: "Reports",
      icon: BarChart,
      module: "reports" as keyof UserPermissions,
      actions: [
        { key: "view", label: "View Reports" },
        { key: "export", label: "Export Reports" }
      ]
    },
    {
      title: "Suppliers",
      icon: Truck,
      module: "suppliers" as keyof UserPermissions,
      actions: [
        { key: "view", label: "View Suppliers" },
        { key: "create", label: "Add Suppliers" },
        { key: "edit", label: "Edit Suppliers" },
        { key: "delete", label: "Delete Suppliers" }
      ]
    },
    {
      title: "Users",
      icon: User,
      module: "users" as keyof UserPermissions,
      actions: [
        { key: "view", label: "View Users" },
        { key: "create", label: "Add Users" },
        { key: "edit", label: "Edit Users" },
        { key: "delete", label: "Delete Users" }
      ]
    },
    {
      title: "Shops",
      icon: Building,
      module: "shops" as keyof UserPermissions,
      actions: [
        { key: "view", label: "View Shops" },
        { key: "create", label: "Add Shops" },
        { key: "edit", label: "Edit Shops" },
        { key: "delete", label: "Delete Shops" }
      ]
    },
    {
      title: "Settings",
      icon: SettingsIcon,
      module: "settings" as keyof UserPermissions,
      actions: [
        { key: "view", label: "View Settings" },
        { key: "edit", label: "Edit Settings" }
      ]
    }
  ];

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
              {permissionGroups.map((group) => (
                <PermissionGroup
                  key={group.module}
                  title={group.title}
                  icon={group.icon}
                  module={group.module}
                  actions={group.actions}
                  permissions={permissions}
                  onToggle={handlePermissionToggle}
                  activeRole={activeRole}
                />
              ))}
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

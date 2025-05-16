
import React from 'react';
import { 
  ShoppingBag, Package, Users, BarChart, Truck, 
  User, Building, Settings as SettingsIcon
} from 'lucide-react';
import { UserPermissions } from '@/types';
import { PermissionGroup } from './PermissionGroup';

interface PermissionGroupsProps {
  permissions: UserPermissions;
  activeRole: string;
  onToggle: (module: keyof UserPermissions, action: string, value: boolean) => void;
}

export const PermissionGroups: React.FC<PermissionGroupsProps> = ({ 
  permissions, 
  activeRole, 
  onToggle 
}) => {
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {permissionGroups.map((group) => (
        <PermissionGroup
          key={group.module}
          title={group.title}
          icon={group.icon}
          module={group.module}
          actions={group.actions}
          permissions={permissions}
          onToggle={onToggle}
          activeRole={activeRole}
        />
      ))}
    </div>
  );
};

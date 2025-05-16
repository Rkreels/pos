
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface RoleSelectorProps {
  activeRole: string;
  onRoleChange: (role: 'admin' | 'master' | 'manager' | 'cashier') => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ activeRole, onRoleChange }) => {
  return (
    <TabsList className="mb-4">
      <TabsTrigger value="admin" onClick={() => onRoleChange('admin')}>Admin</TabsTrigger>
      <TabsTrigger value="master" onClick={() => onRoleChange('master')}>Master Manager</TabsTrigger>
      <TabsTrigger value="manager" onClick={() => onRoleChange('manager')}>Manager</TabsTrigger>
      <TabsTrigger value="cashier" onClick={() => onRoleChange('cashier')}>Cashier</TabsTrigger>
    </TabsList>
  );
};

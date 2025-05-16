
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { voiceAssistant } from '@/services/VoiceAssistant';

interface RoleSelectorProps {
  activeRole: string;
  onRoleChange: (role: 'admin' | 'master' | 'manager' | 'cashier') => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ activeRole, onRoleChange }) => {
  const handleRoleChange = (role: 'admin' | 'master' | 'manager' | 'cashier') => {
    onRoleChange(role);
    voiceAssistant.speakRoleChanged(role);
  };

  return (
    <TabsList className="mb-4">
      <TabsTrigger value="admin" onClick={() => handleRoleChange('admin')}>Admin</TabsTrigger>
      <TabsTrigger value="master" onClick={() => handleRoleChange('master')}>Master Manager</TabsTrigger>
      <TabsTrigger value="manager" onClick={() => handleRoleChange('manager')}>Manager</TabsTrigger>
      <TabsTrigger value="cashier" onClick={() => handleRoleChange('cashier')}>Cashier</TabsTrigger>
    </TabsList>
  );
};

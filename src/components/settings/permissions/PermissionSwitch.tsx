
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { UserPermissions } from '@/types';

interface PermissionSwitchProps {
  module: keyof UserPermissions;
  action: string;
  label: string;
  permissions: UserPermissions;
  onToggle: (module: keyof UserPermissions, action: string, value: boolean) => void;
  disabled?: boolean;
}

export const PermissionSwitch: React.FC<PermissionSwitchProps> = ({ 
  module, 
  action, 
  label, 
  permissions,
  onToggle,
  disabled = false
}) => {
  return (
    <div className="flex items-center justify-between py-2">
      <Label htmlFor={`${module}-${action}`} className="flex-1">{label}</Label>
      <Switch 
        id={`${module}-${action}`} 
        checked={permissions[module] ? Boolean((permissions[module] as any)[action]) : false} 
        onCheckedChange={(checked) => onToggle(module, action, checked)}
        disabled={disabled}
      />
    </div>
  );
};

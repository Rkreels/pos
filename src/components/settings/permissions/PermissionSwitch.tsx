
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { UserPermissions } from '@/types';
import { toast } from 'sonner';

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
  const isChecked = permissions[module] ? Boolean((permissions[module] as any)[action]) : false;
  
  const handleToggle = (checked: boolean) => {
    // If trying to disable view access for admin, show warning
    if (module === "inventory" && action === "view" && !checked && disabled) {
      toast.warning("Admin users must have view access to all areas");
      return;
    }
    
    onToggle(module, action, checked);
    
    // Provide feedback on permission changes
    if (checked) {
      toast.info(`Enabled: ${label} for ${module}`);
    } else {
      toast.info(`Disabled: ${label} for ${module}`);
    }
  };
  
  return (
    <div className="flex items-center justify-between py-2">
      <Label 
        htmlFor={`${module}-${action}`} 
        className={`flex-1 ${disabled ? 'text-gray-500' : ''}`}
      >
        {label}
      </Label>
      <Switch 
        id={`${module}-${action}`} 
        checked={isChecked} 
        onCheckedChange={handleToggle}
        disabled={disabled}
        className={disabled ? 'opacity-70' : ''}
      />
    </div>
  );
};


import React from 'react';
import { Separator } from '@/components/ui/separator';
import { PermissionSwitch } from './PermissionSwitch';
import { LucideIcon } from 'lucide-react';
import { UserPermissions } from '@/types';

interface PermissionGroupProps {
  title: string;
  icon: LucideIcon;
  permissions: UserPermissions;
  module: keyof UserPermissions;
  actions: Array<{ key: string; label: string }>;
  onToggle: (module: keyof UserPermissions, action: string, value: boolean) => void;
  activeRole: string;
}

export const PermissionGroup: React.FC<PermissionGroupProps> = ({
  title,
  icon: Icon,
  permissions,
  module,
  actions,
  onToggle,
  activeRole
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold flex items-center">
        <Icon className="w-5 h-5 mr-2" /> {title}
      </h3>
      
      {actions.map(action => (
        <PermissionSwitch
          key={`${module}-${action.key}`}
          module={module}
          action={action.key}
          label={action.label}
          permissions={permissions}
          onToggle={onToggle}
          disabled={activeRole === 'admin' && action.key === 'view'}
        />
      ))}
      
      <Separator />
    </div>
  );
};

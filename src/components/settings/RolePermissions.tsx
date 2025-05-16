
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { rbac } from '@/services/RoleBasedAccessControl';
import { UserPermissions } from '@/types';
import { RolePermissionsHeader } from './permissions/RolePermissionsHeader';
import { RoleSelector } from './permissions/RoleSelector';
import { PermissionGroups } from './permissions/PermissionGroups';
import { RoleNote } from './permissions/RoleNote';
import { PermissionActions } from './permissions/PermissionActions';
import { voiceAssistant } from '@/services/VoiceAssistant';

export const RolePermissions: React.FC = () => {
  const [activeRole, setActiveRole] = useState<'admin' | 'master' | 'manager' | 'cashier'>('admin');
  const [permissions, setPermissions] = useState<UserPermissions>(rbac.getUserPermissions({ role: activeRole } as any));

  // Load default permissions for the selected role
  useEffect(() => {
    setPermissions(rbac.getUserPermissions({ role: activeRole } as any));
    voiceAssistant.speak(`Now viewing permissions for ${activeRole} role. You can modify access levels for different system functions.`);
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
    
    const actionText = value ? "granted" : "removed";
    voiceAssistant.speak(`${action} permission for ${module} has been ${actionText}.`);
  };

  // Save permission changes
  const handleSavePermissions = () => {
    // In a real app, this would update permissions in the database
    toast.success(`Permissions updated for ${activeRole} role`);
  };

  return (
    <Card>
      <RolePermissionsHeader />
      <CardContent>
        <Tabs defaultValue={activeRole} onValueChange={(value) => setActiveRole(value as typeof activeRole)}>
          <RoleSelector activeRole={activeRole} onRoleChange={setActiveRole} />
          
          <TabsContent value={activeRole} className="space-y-4">
            <PermissionGroups 
              permissions={permissions} 
              activeRole={activeRole} 
              onToggle={handlePermissionToggle} 
            />
            
            <PermissionActions 
              activeRole={activeRole}
              permissions={permissions}
              handleSavePermissions={handleSavePermissions}
            />
            
            <RoleNote role={activeRole} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

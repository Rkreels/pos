
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { voiceAssistant } from '@/services/VoiceAssistant';
import { UserPermissions } from '@/types';

interface PermissionActionsProps {
  activeRole: string;
  permissions: UserPermissions;
  handleSavePermissions: () => void;
}

export const PermissionActions: React.FC<PermissionActionsProps> = ({
  activeRole,
  permissions,
  handleSavePermissions
}) => {
  const onSave = () => {
    handleSavePermissions();
    voiceAssistant.speak(`Permissions for ${activeRole} role have been updated successfully.`);
  };

  return (
    <div className="flex justify-end mt-6">
      <Button onClick={onSave}>
        Save {activeRole.charAt(0).toUpperCase() + activeRole.slice(1)} Permissions
      </Button>
    </div>
  );
};

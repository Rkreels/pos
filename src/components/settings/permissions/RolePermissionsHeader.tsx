
import React, { useEffect } from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { voiceAssistant } from '@/services/VoiceAssistant';

export const RolePermissionsHeader: React.FC = () => {
  useEffect(() => {
    // Provide voice guidance when the component mounts
    const timer = setTimeout(() => {
      voiceAssistant.speakPermissionsManagement();
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <CardHeader>
      <CardTitle>Role Permissions</CardTitle>
      <CardDescription>Configure access permissions for each role in the system</CardDescription>
    </CardHeader>
  );
};

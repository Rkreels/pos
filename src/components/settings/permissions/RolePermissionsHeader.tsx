
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const RolePermissionsHeader: React.FC = () => {
  return (
    <CardHeader>
      <CardTitle>Role Permissions</CardTitle>
      <CardDescription>Configure access permissions for each role in the system</CardDescription>
    </CardHeader>
  );
};

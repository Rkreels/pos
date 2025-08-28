
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { RoleSelector } from '@/components/RoleSelector';

interface SidebarProfileProps {
  isSidebarExpanded: boolean;
}

export const SidebarProfile: React.FC<SidebarProfileProps> = ({ isSidebarExpanded }) => {
  const { currentUser } = useAuth();
  
  return (
    <div className="border-t border-sidebar-border p-4">
      <div className="flex flex-col gap-3">
        {isSidebarExpanded ? (
          <div className="flex flex-col space-y-1">
            <div className="text-sm font-medium text-sidebar-foreground">
              Current Role: {currentUser.role}
            </div>
            <div className="text-xs text-sidebar-muted-foreground">
              {currentUser.email}
            </div>
            <div className="mt-2">
              <RoleSelector />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-2">
            <div className="text-xs text-sidebar-muted-foreground text-center">
              {currentUser.role}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { RoleSelector } from '@/components/RoleSelector';

interface SidebarProfileProps {
  isSidebarExpanded: boolean;
}

export const SidebarProfile: React.FC<SidebarProfileProps> = ({ isSidebarExpanded }) => {
  const { logout, currentUser } = useAuth();
  
  if (!isSidebarExpanded) {
    return null;
  }
  
  return (
    <div className="p-3 border-t mt-auto">
      <div className="mb-3">
        <RoleSelector />
      </div>
      
      <Button 
        variant="ghost" 
        className="w-full flex items-center justify-start text-red-500" 
        onClick={logout}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
      
      <div className="mt-2 text-xs text-gray-500 flex items-center">
        <span className="mr-1">Logged in as:</span>
        <span className="font-medium">{currentUser.name}</span>
      </div>
    </div>
  );
};


import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { RocketIcon, LogOut } from 'lucide-react';
import { RoleSelector } from '@/components/RoleSelector';
import { useNavigate } from 'react-router-dom';
import { voiceAssistant } from '@/services/VoiceAssistant';

interface SidebarProfileProps {
  isSidebarExpanded: boolean;
}

export const SidebarProfile: React.FC<SidebarProfileProps> = ({ isSidebarExpanded }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    voiceAssistant.speak("You are now logging out. Thank you for using our system.");
    logout();
    navigate('/');
  };
  
  const handleSettings = () => {
    voiceAssistant.speak("Navigating to your account settings page.");
    navigate('/settings');
  };
  
  return (
    <div className="border-t border-gray-200 p-4">
      <div className="flex flex-col gap-3">
        {isSidebarExpanded ? (
          <>
            <div className="flex flex-col space-y-1">
              <div className="text-sm font-medium">
                Signed in as {currentUser.role}
              </div>
              <div className="text-xs text-gray-500">
                {currentUser.email}
              </div>
              <div className="mt-2">
                <RoleSelector />
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-1/2"
                onClick={handleSettings}
              >
                <RocketIcon className="h-4 w-4 mr-1" /> Account
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-1/2 text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-1" /> Logout
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 py-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8"
              onClick={handleSettings}
            >
              <RocketIcon className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

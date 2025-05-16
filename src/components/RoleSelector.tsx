
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { voiceAssistant } from '@/services/VoiceAssistant';

export const RoleSelector: React.FC = () => {
  const { userList, currentUser, setCurrentUser } = useAuth();

  // Badges for different roles
  const roleBadges = {
    admin: <Badge variant="destructive">Admin</Badge>,
    master: <Badge variant="default">Master</Badge>,
    manager: <Badge variant="secondary">Manager</Badge>,
    cashier: <Badge variant="outline">Cashier</Badge>,
  };

  const handleUserChange = (userId: string) => {
    const selectedUser = userList.find(user => user.id === userId);
    if (selectedUser) {
      setCurrentUser(selectedUser);
      voiceAssistant.speakRoleOverview(selectedUser.role);
    }
  };

  return (
    <div className="flex flex-col gap-1 z-50">
      <Select value={currentUser.id || "select-user"} onValueChange={handleUserChange}>
        <SelectTrigger className="w-full h-8 text-xs max-w-[180px]">
          <div className="flex items-center gap-2 truncate">
            <span className="truncate max-w-[100px]">{currentUser.name}</span>
            {currentUser.role && roleBadges[currentUser.role as keyof typeof roleBadges]}
          </div>
        </SelectTrigger>
        <SelectContent>
          {userList.map((user) => (
            <SelectItem key={user.id || `user-${user.name}`} value={user.id || `user-${user.name.replace(/\s+/g, '-').toLowerCase()}`}>
              <div className="flex items-center gap-2">
                <span>{user.name}</span>
                {user.role && roleBadges[user.role as keyof typeof roleBadges]}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};


import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/types';
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
    <div className="flex flex-col gap-1">
      <Select value={currentUser.id} onValueChange={handleUserChange}>
        <SelectTrigger className="w-full h-8 text-xs">
          <div className="flex items-center gap-2">
            <span className="truncate">{currentUser.name}</span>
            {roleBadges[currentUser.role as keyof typeof roleBadges]}
          </div>
        </SelectTrigger>
        <SelectContent>
          {userList.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              <div className="flex items-center gap-2">
                <span>{user.name}</span>
                {roleBadges[user.role as keyof typeof roleBadges]}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};


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
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Test as:</span>
      <Select value={currentUser.id} onValueChange={handleUserChange}>
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Select user" />
        </SelectTrigger>
        <SelectContent>
          {userList.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              <div className="flex items-center justify-between gap-2">
                <span>{user.name}</span>
                {roleBadges[user.role as keyof typeof roleBadges]}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div>{roleBadges[currentUser.role as keyof typeof roleBadges]}</div>
    </div>
  );
};

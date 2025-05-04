
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, UserPermissions } from '@/types';
import { rbac } from '@/services/RoleBasedAccessControl';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

// Sample user data for demo
const sampleUsers: User[] = [
  {
    id: '1',
    name: 'John Admin',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2025-04-28 10:23'
  },
  {
    id: '2',
    name: 'Sarah Manager',
    email: 'manager@example.com',
    role: 'manager',
    status: 'active',
    lastLogin: '2025-04-27 15:45',
    managedShops: ['1']
  },
  {
    id: '3',
    name: 'Michael Cashier',
    email: 'cashier@example.com',
    role: 'cashier',
    status: 'active',
    lastLogin: '2025-04-29 09:10'
  },
  {
    id: '5',
    name: 'Mark Master',
    email: 'master@example.com',
    role: 'master',
    status: 'active',
    lastLogin: '2025-04-29 08:00',
    managedShops: ['1', '2', '3']
  }
];

// Default to master user for demo
const defaultUser = sampleUsers.find(user => user.role === 'master') || sampleUsers[0];

interface AuthContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  logout: () => void;
  hasPermission: (module: string, action: string) => boolean;
  checkRouteAccess: (route: string) => boolean;
  userList: User[];
}

const AuthContext = createContext<AuthContextType>({
  currentUser: defaultUser,
  setCurrentUser: () => {},
  logout: () => {},
  hasPermission: () => false,
  checkRouteAccess: () => false,
  userList: sampleUsers
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(defaultUser);
  const [userList] = useState<User[]>(sampleUsers);
  const navigate = useNavigate();
  const location = useLocation();

  // Check route access when location changes
  useEffect(() => {
    const route = location.pathname;
    const hasAccess = rbac.getRouteAccess(currentUser)[route];
    
    if (route !== '/' && !hasAccess) {
      toast.error("You don't have permission to access this page");
      navigate('/');
    }
  }, [location.pathname, currentUser, navigate]);

  const logout = () => {
    // In a real app, you would call your auth service logout method
    toast.info("Logged out successfully");
    setCurrentUser(sampleUsers[0]); // Reset to default user
    navigate('/');
  };

  const hasPermission = (module: string, action: string) => {
    // Fix: Use module as keyof UserPermissions instead of trying to use typeof with a function call
    return rbac.hasPermission(
      currentUser, 
      module as keyof UserPermissions,
      action
    );
  };

  const checkRouteAccess = (route: string) => {
    const routeAccessMap = rbac.getRouteAccess(currentUser);
    return routeAccessMap[route] || false;
  };

  return (
    <AuthContext.Provider 
      value={{ 
        currentUser, 
        setCurrentUser, 
        logout, 
        hasPermission, 
        checkRouteAccess,
        userList
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

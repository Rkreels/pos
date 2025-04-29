
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus, Lock, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { voiceAssistant } from '@/services/VoiceAssistant';

// Define user types with TypeScript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'cashier';
  status: 'active' | 'inactive';
  lastLogin?: string;
}

// Sample users data
const initialUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active', lastLogin: '2025-04-29 10:30 AM' },
  { id: '2', name: 'Store Manager', email: 'manager@example.com', role: 'manager', status: 'active', lastLogin: '2025-04-28 8:45 AM' },
  { id: '3', name: 'Cashier 1', email: 'cashier1@example.com', role: 'cashier', status: 'active', lastLogin: '2025-04-29 9:15 AM' },
  { id: '4', name: 'Cashier 2', email: 'cashier2@example.com', role: 'cashier', status: 'inactive', lastLogin: '2025-04-25 5:30 PM' },
];

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Form states
  const [newUser, setNewUser] = useState<Omit<User, 'id' | 'status' | 'lastLogin'>>({
    name: '',
    email: '',
    role: 'cashier'
  });
  
  // Add new user
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast.error('Name and email are required');
      return;
    }
    
    const newUserId = (users.length + 1).toString();
    const userToAdd: User = {
      id: newUserId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'active'
    };
    
    setUsers([...users, userToAdd]);
    setIsAddUserOpen(false);
    setNewUser({ name: '', email: '', role: 'cashier' });
    toast.success('User added successfully');
    voiceAssistant.speak('New user has been added successfully. They will receive an email with instructions to set up their password.');
  };
  
  // Update existing user
  const handleUpdateUser = () => {
    if (!selectedUser || !selectedUser.name || !selectedUser.email) {
      toast.error('Name and email are required');
      return;
    }
    
    const updatedUsers = users.map(user => 
      user.id === selectedUser.id ? selectedUser : user
    );
    
    setUsers(updatedUsers);
    setIsEditUserOpen(false);
    setSelectedUser(null);
    toast.success('User updated successfully');
    voiceAssistant.speak('User information has been updated successfully.');
  };
  
  // Reset user password
  const handleResetPassword = () => {
    if (!selectedUser) return;
    
    // In a real app, this would trigger a password reset email
    setIsResetPasswordOpen(false);
    toast.success(`Password reset link sent to ${selectedUser.email}`);
    voiceAssistant.speak(`A password reset link has been sent to ${selectedUser.email}`);
    setSelectedUser(null);
  };
  
  // Toggle user status (active/inactive)
  const toggleUserStatus = (userId: string) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        return { ...user, status: newStatus };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    const targetUser = updatedUsers.find(user => user.id === userId);
    const statusText = targetUser?.status === 'active' ? 'activated' : 'deactivated';
    toast.success(`User ${statusText} successfully`);
    voiceAssistant.speak(`User account has been ${statusText}.`);
  };
  
  // Delete user
  const handleDeleteUser = (userId: string) => {
    const filteredUsers = users.filter(user => user.id !== userId);
    setUsers(filteredUsers);
    toast.success('User deleted successfully');
    voiceAssistant.speak('User has been removed from the system.');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>User Management</CardTitle>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account. They will receive an email to set their password.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="John Doe" 
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="email@example.com" 
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={newUser.role} 
                  onValueChange={(value: any) => setNewUser({...newUser, role: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="cashier">Cashier</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>Cancel</Button>
              <Button onClick={handleAddUser}>Add User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={
                    user.role === 'admin' ? 'default' : 
                    user.role === 'manager' ? 'secondary' : 'outline'
                  }>
                    {user.role === 'admin' ? 'Administrator' : 
                     user.role === 'manager' ? 'Manager' : 'Cashier'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.status === 'active' ? 'success' : 'destructive'}>
                    {user.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>{user.lastLogin || 'Never'}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setSelectedUser(user)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        {selectedUser && (
                          <>
                            <DialogHeader>
                              <DialogTitle>Edit User</DialogTitle>
                              <DialogDescription>
                                Update user information and permissions.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label htmlFor="edit-name">Full Name</Label>
                                <Input 
                                  id="edit-name" 
                                  value={selectedUser.name} 
                                  onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="edit-email">Email</Label>
                                <Input 
                                  id="edit-email" 
                                  type="email" 
                                  value={selectedUser.email}
                                  onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="edit-role">Role</Label>
                                <Select 
                                  value={selectedUser.role}
                                  onValueChange={(value: any) => setSelectedUser({...selectedUser, role: value})}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="admin">Administrator</SelectItem>
                                    <SelectItem value="manager">Manager</SelectItem>
                                    <SelectItem value="cashier">Cashier</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="edit-status">Status</Label>
                                <Select 
                                  value={selectedUser.status}
                                  onValueChange={(value: any) => setSelectedUser({...selectedUser, status: value})}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button 
                                variant="outline" 
                                onClick={() => {
                                  setIsEditUserOpen(false);
                                  setSelectedUser(null);
                                }}
                              >
                                Cancel
                              </Button>
                              <Button onClick={handleUpdateUser}>Save Changes</Button>
                            </DialogFooter>
                          </>
                        )}
                      </DialogContent>
                    </Dialog>
                    
                    <Dialog open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setSelectedUser(user)}
                        >
                          <Lock className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        {selectedUser && (
                          <>
                            <DialogHeader>
                              <DialogTitle>Reset Password</DialogTitle>
                              <DialogDescription>
                                Send a password reset link to {selectedUser.email}.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => {
                                setIsResetPasswordOpen(false);
                                setSelectedUser(null);
                              }}>
                                Cancel
                              </Button>
                              <Button onClick={handleResetPassword}>Send Reset Link</Button>
                            </DialogFooter>
                          </>
                        )}
                      </DialogContent>
                    </Dialog>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleUserStatus(user.id)}
                    >
                      <Badge variant={user.status === 'active' ? 'destructive' : 'success'} className="cursor-pointer">
                        {user.status === 'active' ? 'Deactivate' : 'Activate'}
                      </Badge>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

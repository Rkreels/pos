
import { User, UserPermissions } from "@/types";

// Default role-based permissions mapping
const defaultPermissions: Record<'admin' | 'master' | 'manager' | 'cashier', UserPermissions> = {
  admin: {
    inventory: { view: true, edit: true, delete: true },
    pos: { access: true, applyDiscounts: true, voidTransactions: true },
    customers: { view: true, edit: true, delete: true },
    reports: { view: true, export: true },
    settings: { view: true, edit: true },
    users: { view: true, create: true, edit: true, delete: true },
    shops: { view: true, create: true, edit: true, delete: true },
    suppliers: { view: true, create: true, edit: true, delete: true }
  },
  master: {
    inventory: { view: true, edit: true, delete: true },
    pos: { access: true, applyDiscounts: true, voidTransactions: true },
    customers: { view: true, edit: true, delete: true },
    reports: { view: true, export: true },
    settings: { view: true, edit: false },
    users: { view: true, create: true, edit: true, delete: false },
    shops: { view: true, create: false, edit: true, delete: false },
    suppliers: { view: true, create: true, edit: true, delete: true }
  },
  manager: {
    inventory: { view: true, edit: true, delete: false },
    pos: { access: true, applyDiscounts: true, voidTransactions: false },
    customers: { view: true, edit: true, delete: false },
    reports: { view: true, export: true },
    settings: { view: false, edit: false },
    users: { view: true, create: false, edit: false, delete: false },
    shops: { view: false, create: false, edit: false, delete: false },
    suppliers: { view: true, create: false, edit: false, delete: false }
  },
  cashier: {
    inventory: { view: true, edit: false, delete: false },
    pos: { access: true, applyDiscounts: false, voidTransactions: false },
    customers: { view: true, edit: false, delete: false },
    reports: { view: false, export: false },
    settings: { view: false, edit: false },
    users: { view: false, create: false, edit: false, delete: false },
    shops: { view: false, create: false, edit: false, delete: false },
    suppliers: { view: false, create: false, edit: false, delete: false }
  }
};

class RoleBasedAccessControl {
  // Get default permissions for a role
  getDefaultPermissions(role: 'admin' | 'master' | 'manager' | 'cashier'): UserPermissions {
    return defaultPermissions[role];
  }

  // Get permissions for a specific user
  getUserPermissions(user: User): UserPermissions {
    // Use custom permissions if defined, otherwise use default permissions for the role
    return user.permissions || this.getDefaultPermissions(user.role);
  }

  // Check if user has a specific permission
  hasPermission(user: User, module: keyof UserPermissions, action: string): boolean {
    // Get user permissions
    const permissions = this.getUserPermissions(user);
    
    // If module and action exist in permissions, return the value
    if (permissions[module] && action in permissions[module]) {
      return permissions[module][action as keyof typeof permissions[module]];
    }
    
    // Default to false if permission is not found
    return false;
  }

  // Generate route access map for a user
  getRouteAccess(user: User): Record<string, boolean> {
    const permissions = this.getUserPermissions(user);
    
    return {
      '/': true, // Everyone can access dashboard
      '/pos': permissions.pos.access,
      '/inventory': permissions.inventory.view,
      '/customers': permissions.customers.view,
      '/reports': permissions.reports.view,
      '/settings': permissions.settings.view || user.role === 'admin',
      '/shops': permissions.shops.view || user.role === 'admin' || user.role === 'master',
      '/suppliers': permissions.suppliers.view
    };
  }
}

export const rbac = new RoleBasedAccessControl();
export default rbac;

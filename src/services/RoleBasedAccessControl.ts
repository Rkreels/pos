
import { User, UserPermissions } from '@/types';

class RoleBasedAccessControl {
  // Define default permissions for each role
  private readonly defaultPermissions: Record<string, UserPermissions> = {
    admin: {
      inventory: { view: true, add: true, edit: true, delete: true },
      sales: { view: true, process: true, refund: true, export: true },
      customers: { view: true, add: true, edit: true, delete: true },
      reports: { view: true, export: true },
      settings: { view: true, edit: true },
      shops: { view: true, add: true, edit: true, delete: true },
      suppliers: { view: true, add: true, edit: true, delete: true },
      exchange: { view: true, request: true, send: true, approve: true, reject: true },
      pos: { access: true, applyDiscounts: true, voidTransactions: true },
      users: { view: true, create: true, edit: true, delete: true }
    },
    manager: {
      inventory: { view: true, add: true, edit: true, delete: false },
      sales: { view: true, process: true, refund: true, export: false },
      customers: { view: true, add: true, edit: true, delete: false },
      reports: { view: true, export: true },
      settings: { view: true, edit: false },
      shops: { view: true, add: false, edit: false, delete: false },
      suppliers: { view: true, add: true, edit: false, delete: false },
      exchange: { view: true, request: true, send: true, approve: true, reject: false },
      pos: { access: true, applyDiscounts: true, voidTransactions: false },
      users: { view: true, create: false, edit: false, delete: false }
    },
    cashier: {
      inventory: { view: true, add: false, edit: false, delete: false },
      sales: { view: true, process: true, refund: false, export: false },
      customers: { view: true, add: true, edit: false, delete: false },
      reports: { view: true, export: false },
      settings: { view: false, edit: false },
      shops: { view: false, add: false, edit: false, delete: false },
      suppliers: { view: false, add: false, edit: false, delete: false },
      exchange: { view: false, request: false, send: false, approve: false, reject: false },
      pos: { access: true, applyDiscounts: false, voidTransactions: false },
      users: { view: false, create: false, edit: false, delete: false }
    },
    master: {
      inventory: { view: true, add: true, edit: true, delete: true },
      sales: { view: true, process: true, refund: true, export: true },
      customers: { view: true, add: true, edit: true, delete: true },
      reports: { view: true, export: true },
      settings: { view: true, edit: true },
      shops: { view: true, add: true, edit: true, delete: true },
      suppliers: { view: true, add: true, edit: true, delete: true },
      exchange: { view: true, request: true, send: true, approve: true, reject: true },
      pos: { access: true, applyDiscounts: true, voidTransactions: true },
      users: { view: true, create: true, edit: true, delete: true }
    }
  };

  // Define route access for each role
  private readonly routeAccess: Record<string, Record<string, boolean>> = {
    admin: {
      '/': true,
      '/pos': true,
      '/inventory': true,
      '/reports': true,
      '/customers': true,
      '/settings': true,
      '/shops': true,
      '/suppliers': true,
    },
    manager: {
      '/': true,
      '/pos': true,
      '/inventory': true,
      '/reports': true,
      '/customers': true,
      '/settings': true,
      '/shops': true,
      '/suppliers': true,
    },
    cashier: {
      '/': true,
      '/pos': true,
      '/inventory': true,
      '/customers': true,
      '/reports': true,
      '/settings': false,
      '/shops': false,
      '/suppliers': false,
    },
    master: {
      '/': true,
      '/pos': true,
      '/inventory': true,
      '/reports': true,
      '/customers': true,
      '/settings': true,
      '/shops': true,
      '/suppliers': true,
    }
  };

  getUserPermissions(user: User): UserPermissions {
    return this.defaultPermissions[user.role] || this.defaultPermissions.cashier;
  }

  getDefaultPermissions(role: string): UserPermissions {
    return this.defaultPermissions[role as keyof typeof this.defaultPermissions] || this.defaultPermissions.cashier;
  }

  hasPermission(user: User, module: keyof UserPermissions, action: string): boolean {
    const permissions = this.getUserPermissions(user);
    const modulePermissions = permissions[module];
    
    if (!modulePermissions) return false;
    
    return (modulePermissions as Record<string, boolean>)[action] || false;
  }

  getRouteAccess(user: User): Record<string, boolean> {
    return this.routeAccess[user.role] || this.routeAccess.cashier;
  }
}

export const rbac = new RoleBasedAccessControl();

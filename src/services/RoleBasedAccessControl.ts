
import { User, UserPermissions } from '@/types';

class RoleBasedAccessControl {
  // Define default permissions for each role
  private readonly defaultPermissions: Record<string, UserPermissions> = {
    admin: {
      inventory: ['view', 'add', 'edit', 'delete'],
      sales: ['view', 'process', 'refund', 'export'],
      customers: ['view', 'add', 'edit', 'delete'],
      reports: ['view', 'export'],
      settings: ['view', 'edit'],
      shops: ['view', 'add', 'edit', 'delete'],
      suppliers: ['view', 'add', 'edit', 'delete'],
      exchange: ['view', 'request', 'send', 'approve', 'reject']
    },
    manager: {
      inventory: ['view', 'add', 'edit'],
      sales: ['view', 'process', 'refund'],
      customers: ['view', 'add', 'edit'],
      reports: ['view', 'export'],
      settings: ['view'],
      shops: ['view'],
      suppliers: ['view', 'add'],
      exchange: ['view', 'request', 'send', 'approve']
    },
    cashier: {
      inventory: ['view'],
      sales: ['view', 'process'],
      customers: ['view', 'add'],
      reports: ['view'],
      settings: [],
      shops: [],
      suppliers: [],
      exchange: []
    },
    master: {
      inventory: ['view', 'add', 'edit', 'delete'],
      sales: ['view', 'process', 'refund', 'export'],
      customers: ['view', 'add', 'edit', 'delete'],
      reports: ['view', 'export'],
      settings: ['view', 'edit'],
      shops: ['view', 'add', 'edit', 'delete'],
      suppliers: ['view', 'add', 'edit', 'delete'],
      exchange: ['view', 'request', 'send', 'approve', 'reject']
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

  hasPermission(user: User, module: keyof UserPermissions, action: string): boolean {
    const permissions = this.getUserPermissions(user);
    return permissions[module]?.includes(action) || false;
  }

  getRouteAccess(user: User): Record<string, boolean> {
    return this.routeAccess[user.role] || this.routeAccess.cashier;
  }
}

export const rbac = new RoleBasedAccessControl();

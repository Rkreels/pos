// Preloader utility to reduce loading times for navigation
class RoutePreloader {
  private preloadedComponents: Map<string, Promise<any>> = new Map();
  
  // Preload route components based on user permissions and likelihood of access
  preloadRoutes(userRole: string) {
    const commonRoutes = ['/inventory', '/pos', '/reports'];
    const adminRoutes = ['/shops', '/settings', '/customers', '/suppliers'];
    
    let routesToPreload = [...commonRoutes];
    
    if (userRole === 'admin' || userRole === 'master') {
      routesToPreload = [...routesToPreload, ...adminRoutes];
    }
    
    routesToPreload.forEach(route => {
      this.preloadRoute(route);
    });
  }
  
  private preloadRoute(route: string) {
    if (this.preloadedComponents.has(route)) {
      return;
    }
    
    let componentPromise: Promise<any>;
    
    switch (route) {
      case '/inventory':
        componentPromise = import('../pages/InventoryPage');
        break;
      case '/pos':
        componentPromise = import('../pages/POSPage');
        break;
      case '/reports':
        componentPromise = import('../pages/ReportsPage');
        break;
      case '/shops':
        componentPromise = import('../pages/ShopsPage');
        break;
      case '/settings':
        componentPromise = import('../pages/SettingsPage');
        break;
      case '/customers':
        componentPromise = import('../pages/CustomersPage');
        break;
      case '/suppliers':
        componentPromise = import('../pages/SuppliersPage');
        break;
      default:
        return;
    }
    
    this.preloadedComponents.set(route, componentPromise);
    
    // Preload the component
    componentPromise.catch(error => {
      console.warn(`Failed to preload route ${route}:`, error);
      this.preloadedComponents.delete(route);
    });
  }
  
  // Get preloaded component if available
  getPreloadedComponent(route: string) {
    return this.preloadedComponents.get(route);
  }
  
  // Clear preloaded components (useful for memory management)
  clearPreloadedComponents() {
    this.preloadedComponents.clear();
  }
}

export const routePreloader = new RoutePreloader();
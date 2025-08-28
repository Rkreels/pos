export interface UserInteraction {
  id: string;
  module: string;
  action: string;
  timestamp: number;
  duration?: number;
  success: boolean;
  details?: any;
}

export interface UserProgress {
  userId: string;
  totalInteractions: number;
  completedTasks: number;
  moduleStats: {
    [module: string]: {
      interactions: number;
      completions: number;
      averageTime: number;
      successRate: number;
    };
  };
  overallRating: number;
  lastActivity: number;
}

class ProgressTracker {
  private interactions: UserInteraction[] = [];
  private currentSessions: Map<string, { startTime: number; module: string; action: string }> = new Map();

  constructor() {
    this.loadProgress();
  }

  private loadProgress(): void {
    try {
      const stored = localStorage.getItem('user-progress-interactions');
      if (stored) {
        this.interactions = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading progress data:', error);
      this.interactions = [];
    }
  }

  private saveProgress(): void {
    try {
      localStorage.setItem('user-progress-interactions', JSON.stringify(this.interactions));
    } catch (error) {
      console.error('Error saving progress data:', error);
    }
  }

  startAction(module: string, action: string): string {
    const sessionId = `${module}-${action}-${Date.now()}-${Math.random()}`;
    this.currentSessions.set(sessionId, {
      startTime: Date.now(),
      module,
      action
    });
    return sessionId;
  }

  completeAction(sessionId: string, success: boolean = true, details?: any): void {
    const session = this.currentSessions.get(sessionId);
    if (!session) return;

    const interaction: UserInteraction = {
      id: sessionId,
      module: session.module,
      action: session.action,
      timestamp: session.startTime,
      duration: Date.now() - session.startTime,
      success,
      details
    };

    this.interactions.push(interaction);
    this.currentSessions.delete(sessionId);
    this.saveProgress();
  }

  trackQuickAction(module: string, action: string, success: boolean = true, details?: any): void {
    const interaction: UserInteraction = {
      id: `${module}-${action}-${Date.now()}-${Math.random()}`,
      module,
      action,
      timestamp: Date.now(),
      success,
      details
    };

    this.interactions.push(interaction);
    this.saveProgress();
  }

  getUserProgress(userId: string = 'default'): UserProgress {
    const moduleStats: { [module: string]: { interactions: number; completions: number; averageTime: number; successRate: number } } = {};
    
    // Group interactions by module
    const moduleGroups = this.interactions.reduce((acc, interaction) => {
      if (!acc[interaction.module]) {
        acc[interaction.module] = [];
      }
      acc[interaction.module].push(interaction);
      return acc;
    }, {} as { [module: string]: UserInteraction[] });

    // Calculate stats for each module
    Object.entries(moduleGroups).forEach(([module, interactions]) => {
      const completions = interactions.filter(i => i.success).length;
      const totalTime = interactions.reduce((sum, i) => sum + (i.duration || 0), 0);
      const avgTime = interactions.length > 0 ? totalTime / interactions.length : 0;
      const successRate = interactions.length > 0 ? completions / interactions.length : 0;

      moduleStats[module] = {
        interactions: interactions.length,
        completions,
        averageTime: avgTime,
        successRate
      };
    });

    // Calculate overall rating (0-100)
    const totalInteractions = this.interactions.length;
    const totalCompletions = this.interactions.filter(i => i.success).length;
    const overallSuccessRate = totalInteractions > 0 ? totalCompletions / totalInteractions : 0;
    
    // Rating based on success rate, frequency of use, and variety of modules used
    const moduleCount = Object.keys(moduleStats).length;
    const varietyBonus = Math.min(moduleCount * 5, 20); // Up to 20 points for variety
    const frequencyScore = Math.min(totalInteractions, 50); // Up to 50 points for frequency
    const overallRating = Math.min(100, (overallSuccessRate * 30) + varietyBonus + frequencyScore);

    return {
      userId,
      totalInteractions,
      completedTasks: totalCompletions,
      moduleStats,
      overallRating: Math.round(overallRating),
      lastActivity: this.interactions.length > 0 ? Math.max(...this.interactions.map(i => i.timestamp)) : 0
    };
  }

  getProgressData(): UserProgress {
    return this.getUserProgress();
  }

  clearProgress(): void {
    this.interactions = [];
    this.currentSessions.clear();
    localStorage.removeItem('user-progress-interactions');
  }

  // Predefined action types for consistency
  static readonly ACTIONS = {
    // POS Actions
    POS_ADD_PRODUCT: 'pos_add_product',
    POS_REMOVE_PRODUCT: 'pos_remove_product',
    POS_CHECKOUT: 'pos_checkout',
    POS_APPLY_DISCOUNT: 'pos_apply_discount',
    
    // Inventory Actions
    INVENTORY_ADD_PRODUCT: 'inventory_add_product',
    INVENTORY_UPDATE_STOCK: 'inventory_update_stock',
    INVENTORY_DELETE_PRODUCT: 'inventory_delete_product',
    INVENTORY_REQUEST_TRANSFER: 'inventory_request_transfer',
    
    // Vendor/Supplier Actions
    SUPPLIER_ADD: 'supplier_add',
    SUPPLIER_UPDATE: 'supplier_update',
    SUPPLIER_VIEW_CATALOG: 'supplier_view_catalog',
    
    // Customer Actions
    CUSTOMER_ADD: 'customer_add',
    CUSTOMER_UPDATE: 'customer_update',
    CUSTOMER_VIEW_HISTORY: 'customer_view_history',
    
    // Report Actions
    REPORTS_VIEW_DAILY: 'reports_view_daily',
    REPORTS_VIEW_WEEKLY: 'reports_view_weekly',
    REPORTS_VIEW_MONTHLY: 'reports_view_monthly',
    REPORTS_EXPORT: 'reports_export',
    
    // Shop Management
    SHOP_SWITCH: 'shop_switch',
    SHOP_ADD: 'shop_add',
    SHOP_UPDATE: 'shop_update'
  } as const;

  static readonly MODULES = {
    POS: 'pos',
    INVENTORY: 'inventory',
    SUPPLIERS: 'suppliers',
    CUSTOMERS: 'customers',
    REPORTS: 'reports',
    SHOPS: 'shops',
    SETTINGS: 'settings',
    DASHBOARD: 'dashboard'
  } as const;
}

export const progressTracker = new ProgressTracker();
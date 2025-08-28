
import React from 'react';
import { 
  ShoppingCart, 
  LayoutDashboard, 
  BarChart, 
  Package, 
  Users, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Truck,
  Building,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { voiceAssistant } from '@/services/VoiceAssistant';
import { ShopSelector } from '@/components/ShopSelector';
import { useShop } from '@/context/ShopContext';
import { useAuth } from '@/context/AuthContext';
import { NavItem } from './navigation/NavItem';
import { SidebarProfile } from './navigation/SidebarProfile';

interface MainNavigationProps {
  isCollapsed?: boolean;
  toggleCollapsed?: () => void;
}

export const MainNavigation: React.FC<MainNavigationProps> = ({ 
  isCollapsed = false, 
  toggleCollapsed 
}) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = React.useState(
    typeof window !== 'undefined' && window.innerWidth >= 768 ? !isCollapsed : false
  );
  const { currentShop } = useShop();
  const { checkRouteAccess } = useAuth();
  
  React.useEffect(() => {
    setIsSidebarExpanded(!isCollapsed);
  }, [isCollapsed]);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarExpanded(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
    if (toggleCollapsed) {
      toggleCollapsed();
    }
  };

  return (
    <div className={cn(
      "h-screen bg-sidebar-background text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 flex flex-col relative z-50",
      isSidebarExpanded ? "w-60" : "w-16",
      // Mobile overlay behavior
      window.innerWidth < 768 && isSidebarExpanded && "fixed inset-y-0 left-0 shadow-lg"
    )}>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          {isSidebarExpanded ? (
            <h1 className="font-bold text-lg">POS System</h1>
          ) : (
            <h1 className="font-bold text-lg">POS</h1>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="h-8 w-8"
          >
            {isSidebarExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>

        {isSidebarExpanded && (
          <div className="mb-4">
            <ShopSelector />
          </div>
        )}
        
        <div className="space-y-1 mt-4">
          <NavItem 
            to="/" 
            icon={LayoutDashboard} 
            title="Dashboard" 
            isSidebarExpanded={isSidebarExpanded} 
            speakFunction={() => voiceAssistant.speakPageOverview()}
            isVisible={true} // Everyone can see dashboard
          />
          <NavItem 
            to="/pos" 
            icon={ShoppingCart} 
            title="Point of Sale" 
            isSidebarExpanded={isSidebarExpanded}
            speakFunction={() => voiceAssistant.speakPOSPage()}
            isVisible={checkRouteAccess('/pos')}
          />
          <NavItem 
            to="/inventory" 
            icon={Package} 
            title="Inventory" 
            isSidebarExpanded={isSidebarExpanded} 
            speakFunction={() => voiceAssistant.speakInventoryPage()}
            isVisible={checkRouteAccess('/inventory')}
          />
          <NavItem 
            to="/suppliers" 
            icon={Truck} 
            title="Suppliers" 
            isSidebarExpanded={isSidebarExpanded} 
            speakFunction={() => voiceAssistant.speakSupplierManagement()}
            isVisible={checkRouteAccess('/suppliers')}
          />
          <NavItem 
            to="/reports" 
            icon={BarChart} 
            title="Sales Reports" 
            isSidebarExpanded={isSidebarExpanded}
            speakFunction={() => voiceAssistant.speakSalesReportPage()}
            isVisible={checkRouteAccess('/reports')}
          />
          <NavItem 
            to="/customers" 
            icon={Users} 
            title="Customers" 
            isSidebarExpanded={isSidebarExpanded}
            speakFunction={() => voiceAssistant.speakCustomersPage()}
            isVisible={checkRouteAccess('/customers')}
          />
          <NavItem 
            to="/shops" 
            icon={Building} 
            title="Shops" 
            isSidebarExpanded={isSidebarExpanded}
            speakFunction={() => voiceAssistant.speakShopManagement()}
            isVisible={checkRouteAccess('/shops')}
          />
          <NavItem 
            to="/settings" 
            icon={Settings} 
            title="Settings" 
            isSidebarExpanded={isSidebarExpanded}
            speakFunction={() => voiceAssistant.speakSettingsPage()}
            isVisible={checkRouteAccess('/settings')}
          />
          <a 
            href="https://skillsim.vercel.app/dashboard"
            target="_self"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all hover:bg-sidebar-accent"
          >
            <ExternalLink className="h-4 w-4" />
            {isSidebarExpanded && <span>Master Dashboard</span>}
          </a>
        </div>
      </div>
      <SidebarProfile isSidebarExpanded={isSidebarExpanded} />
    </div>
  );
};

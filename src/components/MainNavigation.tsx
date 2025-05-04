
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, 
  LayoutDashboard, 
  BarChart, 
  Package, 
  Users, 
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Truck,
  Building,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { voiceAssistant } from '@/services/VoiceAssistant';
import { ShopSelector } from '@/components/ShopSelector';
import { useShop } from '@/context/ShopContext';
import { useAuth } from '@/context/AuthContext';
import { RoleSelector } from './RoleSelector';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  title: string;
  isSidebarExpanded: boolean;
  speakFunction?: () => void;
  isVisible: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ 
  to, 
  icon: Icon, 
  title, 
  isSidebarExpanded,
  speakFunction,
  isVisible
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  if (!isVisible) return null;

  const handleLinkClick = () => {
    // Add a small delay to ensure the page transition happens first
    setTimeout(() => {
      if (speakFunction) {
        speakFunction();
      }
    }, 800);
  };

  return (
    <Link 
      to={to} 
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all hover:bg-sidebar-accent",
        isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "transparent"
      )}
      onClick={handleLinkClick}
    >
      <Icon className="h-4 w-4" />
      {isSidebarExpanded && <span>{title}</span>}
    </Link>
  );
};

interface MainNavigationProps {
  isCollapsed?: boolean;
  toggleCollapsed?: () => void;
}

export const MainNavigation: React.FC<MainNavigationProps> = ({ 
  isCollapsed = false, 
  toggleCollapsed 
}) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = React.useState(!isCollapsed);
  const { currentShop } = useShop();
  const { checkRouteAccess, logout, currentUser } = useAuth();
  
  React.useEffect(() => {
    setIsSidebarExpanded(!isCollapsed);
  }, [isCollapsed]);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
    if (toggleCollapsed) {
      toggleCollapsed();
    }
  };

  return (
    <div className={cn(
      "h-screen bg-sidebar-background text-sidebar-foreground border-r border-gray-200 transition-all duration-300",
      isSidebarExpanded ? "w-60" : "w-16"
    )}>
      <div className="p-4">
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
            <div className="mt-2">
              <RoleSelector />
            </div>
          </div>
        )}
        
        <div className="space-y-1">
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
            speakFunction={() => voiceAssistant.speakPageOverview()}
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
        </div>
        
        {isSidebarExpanded && (
          <div className="absolute bottom-4 left-4 right-4">
            <Button 
              variant="ghost" 
              className="w-full flex items-center justify-start text-red-500" 
              onClick={logout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
            
            <div className="mt-2 text-xs text-gray-500 flex items-center">
              <span className="mr-1">Logged in as:</span>
              <span className="font-medium">{currentUser.name}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

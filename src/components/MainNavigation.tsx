
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
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { voiceAssistant } from '@/services/VoiceAssistant';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  title: string;
  isSidebarExpanded: boolean;
  speakFunction?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ 
  to, 
  icon: Icon, 
  title, 
  isSidebarExpanded,
  speakFunction
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  const handleLinkClick = () => {
    if (speakFunction) {
      speakFunction();
    }
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

export const MainNavigation: React.FC = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = React.useState(true);
  
  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className={cn(
      "h-screen bg-sidebar-background text-sidebar-foreground border-r border-gray-200 transition-all duration-300",
      isSidebarExpanded ? "w-60" : "w-16"
    )}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-8">
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
            {isSidebarExpanded ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
        
        <div className="space-y-1">
          <NavItem 
            to="/" 
            icon={LayoutDashboard} 
            title="Dashboard" 
            isSidebarExpanded={isSidebarExpanded} 
          />
          <NavItem 
            to="/pos" 
            icon={ShoppingCart} 
            title="Point of Sale" 
            isSidebarExpanded={isSidebarExpanded}
          />
          <NavItem 
            to="/inventory" 
            icon={Package} 
            title="Inventory" 
            isSidebarExpanded={isSidebarExpanded} 
            speakFunction={voiceAssistant.speakInventoryPage.bind(voiceAssistant)}
          />
          <NavItem 
            to="/reports" 
            icon={BarChart} 
            title="Sales Reports" 
            isSidebarExpanded={isSidebarExpanded}
            speakFunction={voiceAssistant.speakSalesReportPage.bind(voiceAssistant)}
          />
          <NavItem 
            to="/customers" 
            icon={Users} 
            title="Customers" 
            isSidebarExpanded={isSidebarExpanded}
            speakFunction={voiceAssistant.speakCustomersPage.bind(voiceAssistant)}
          />
          <NavItem 
            to="/settings" 
            icon={Settings} 
            title="Settings" 
            isSidebarExpanded={isSidebarExpanded}
            speakFunction={voiceAssistant.speakSettingsPage.bind(voiceAssistant)}
          />
        </div>
      </div>
    </div>
  );
};

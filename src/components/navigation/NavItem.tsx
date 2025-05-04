
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { voiceAssistant } from '@/services/VoiceAssistant';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  title: string;
  isSidebarExpanded: boolean;
  speakFunction?: () => void;
  isVisible: boolean;
}

export const NavItem: React.FC<NavItemProps> = ({ 
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

import React from 'react';
import { cn } from '@/lib/utils';

interface MobileOverlayProps {
  isVisible: boolean;
  onClick: () => void;
}

export const MobileOverlay: React.FC<MobileOverlayProps> = ({ isVisible, onClick }) => {
  if (!isVisible) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={onClick}
      aria-hidden="true"
    />
  );
};
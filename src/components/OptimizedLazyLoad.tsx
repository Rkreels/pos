import React, { Suspense } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface OptimizedLazyLoadProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

// Optimized lazy loading component with faster transitions
export const OptimizedLazyLoad: React.FC<OptimizedLazyLoadProps> = ({ 
  children, 
  fallback 
}) => {
  const defaultFallback = (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <LoadingSpinner size="md" text="Loading..." />
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
};

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import POSPage from "./pages/POSPage";
import NotFound from "./pages/NotFound";
import { lazy } from "react";
import { OptimizedLazyLoad } from "./components/OptimizedLazyLoad";
import { ShopProvider } from "./context/ShopContext";
import { AuthProvider } from "./context/AuthContext";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Lazy loaded components for better performance
const InventoryPage = lazy(() => import('./pages/InventoryPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const CustomersPage = lazy(() => import('./pages/CustomersPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const SuppliersPage = lazy(() => import('./pages/SuppliersPage'));
const ShopsPage = lazy(() => import('./pages/ShopsPage'));

// Optimized route wrapper
const LazyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <OptimizedLazyLoad>{children}</OptimizedLazyLoad>
);

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <ShopProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/pos" element={<POSPage />} />
                <Route 
                  path="/inventory" 
                  element={
                    <LazyRoute>
                      <InventoryPage />
                    </LazyRoute>
                  } 
                />
                <Route 
                  path="/reports" 
                  element={
                    <LazyRoute>
                      <ReportsPage />
                    </LazyRoute>
                  } 
                />
                <Route 
                  path="/customers" 
                  element={
                    <LazyRoute>
                      <CustomersPage />
                    </LazyRoute>
                  } 
                />
                <Route 
                  path="/suppliers" 
                  element={
                    <LazyRoute>
                      <SuppliersPage />
                    </LazyRoute>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <LazyRoute>
                      <SettingsPage />
                    </LazyRoute>
                  } 
                />
                <Route 
                  path="/shops" 
                  element={
                    <LazyRoute>
                      <ShopsPage />
                    </LazyRoute>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
              </TooltipProvider>
            </ShopProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;

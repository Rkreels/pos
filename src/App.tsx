
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import POSPage from "./pages/POSPage";
import NotFound from "./pages/NotFound";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";
import { ShopProvider } from "./context/ShopContext";

// Lazy loaded components for better performance
const InventoryPage = lazy(() => import('./pages/InventoryPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const CustomersPage = lazy(() => import('./pages/CustomersPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const SuppliersPage = lazy(() => import('./pages/SuppliersPage'));
const ShopsPage = lazy(() => import('./pages/ShopsPage'));

// Loading fallback component for lazy-loaded routes
const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <Loader2 className="h-10 w-10 animate-spin text-primary" />
  </div>
);

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ShopProvider>
        <BrowserRouter>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/pos" element={<POSPage />} />
              <Route 
                path="/inventory" 
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <InventoryPage />
                  </Suspense>
                } 
              />
              <Route 
                path="/reports" 
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ReportsPage />
                  </Suspense>
                } 
              />
              <Route 
                path="/customers" 
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <CustomersPage />
                  </Suspense>
                } 
              />
              <Route 
                path="/suppliers" 
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <SuppliersPage />
                  </Suspense>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <SettingsPage />
                  </Suspense>
                } 
              />
              <Route 
                path="/shops" 
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ShopsPage />
                  </Suspense>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </BrowserRouter>
      </ShopProvider>
    </QueryClientProvider>
  );
};

export default App;

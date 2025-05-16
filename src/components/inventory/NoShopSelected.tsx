
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const NoShopSelected: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 border rounded-lg">
      <p className="text-xl mb-4">Please select a shop to view inventory</p>
      <Button variant="outline" onClick={() => toast.info("Please select a shop from the shop selector")}>
        Select Shop
      </Button>
    </div>
  );
};

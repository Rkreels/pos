import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowRight, Package, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { db } from '@/services/LocalStorageDB';
import { useShop } from '@/context/ShopContext';
import { toast } from 'sonner';
import { formatDate } from '@/utils/formatters';

interface Transfer {
  id: string;
  fromShop: string;
  toShop: string;
  fromShopName: string;
  toShopName: string;
  products: Array<{
    productId: string;
    productName: string;
    productSku: string;
    quantity: number;
  }>;
  type: 'request' | 'send';
  status: 'pending' | 'completed' | 'rejected';
  requestedAt: string;
  completedAt?: string;
  requestedBy: string;
}

export const TransferHistory: React.FC = () => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(false);
  const { currentShop } = useShop();

  const loadTransfers = () => {
    setLoading(true);
    try {
      const allTransfers = db.getTransfers();
      // Filter transfers related to current shop
      const shopTransfers = allTransfers.filter((transfer: Transfer) => 
        transfer.fromShop === currentShop?.id || transfer.toShop === currentShop?.id
      );
      // Sort by most recent first
      shopTransfers.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
      setTransfers(shopTransfers);
    } catch (error) {
      toast.error('Failed to load transfer history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentShop) {
      loadTransfers();
    }
  }, [currentShop]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'secondary',
      completed: 'default',
      rejected: 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {getStatusIcon(status)}
        <span className="ml-1 capitalize">{status}</span>
      </Badge>
    );
  };

  const getTransferDirection = (transfer: Transfer) => {
    const isIncoming = transfer.toShop === currentShop?.id;
    return {
      isIncoming,
      direction: isIncoming ? 'Incoming' : 'Outgoing',
      otherShop: isIncoming ? transfer.fromShopName : transfer.toShopName
    };
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Package className="mr-2 h-5 w-5" />
          Transfer History
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={loadTransfers}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {!currentShop ? (
          <div className="text-center py-8 text-muted-foreground">
            Please select a shop to view transfer history
          </div>
        ) : transfers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No transfers found for this shop
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {transfers.map((transfer) => {
                const { isIncoming, direction, otherShop } = getTransferDirection(transfer);
                const productCount = transfer.products.length;
                const totalQuantity = transfer.products.reduce((sum, p) => sum + p.quantity, 0);
                
                return (
                  <div key={transfer.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant={isIncoming ? 'default' : 'secondary'}>
                          {direction}
                        </Badge>
                        {getStatusBadge(transfer.status)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(new Date(transfer.requestedAt))}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="font-medium">
                        {isIncoming ? transfer.fromShopName : currentShop?.name}
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {isIncoming ? currentShop?.name : transfer.toShopName}
                      </span>
                    </div>
                    
                    <div className="text-sm">
                      <span className="font-medium">{productCount}</span> product{productCount !== 1 ? 's' : ''} • 
                      <span className="font-medium ml-1">{totalQuantity}</span> total items
                    </div>
                    
                    <div className="space-y-1">
                      {transfer.products.map((product, index) => (
                        <div key={index} className="flex justify-between text-xs text-muted-foreground">
                          <span>{product.productName}</span>
                          <span>Qty: {product.quantity}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Transfer ID: {transfer.id}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
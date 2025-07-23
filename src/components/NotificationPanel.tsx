import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, AlertTriangle, Info, CheckCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
  onClearAll: () => void;
}

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    case 'error':
      return <AlertTriangle className="h-4 w-4 text-red-600" />;
    case 'success':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    default:
      return <Info className="h-4 w-4 text-blue-600" />;
  }
};

const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'warning':
      return 'border-l-yellow-500 bg-yellow-50';
    case 'error':
      return 'border-l-red-500 bg-red-50';
    case 'success':
      return 'border-l-green-500 bg-green-50';
    default:
      return 'border-l-blue-500 bg-blue-50';
  }
};

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  onMarkAsRead,
  onDismiss,
  onClearAll
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" onClick={onClearAll}>
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No notifications
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "border-l-4 p-3 rounded-r-md",
                  getNotificationColor(notification.type),
                  !notification.read && "shadow-sm"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2 flex-1">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {notification.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onMarkAsRead(notification.id)}
                        className="h-6 w-6 p-0"
                      >
                        <CheckCircle className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDismiss(notification.id)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
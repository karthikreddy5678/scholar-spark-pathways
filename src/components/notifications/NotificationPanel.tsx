
import React, { useState, useEffect } from "react";
import { BellRing, X, Info, Calendar, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type Notification = {
  id: number;
  title: string;
  message: string;
  category: string;
  created_at: string;
  start_date: string;
  end_date?: string;
  status: string;
};

export function NotificationPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [readNotifications, setReadNotifications] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Load read notifications from localStorage
    const storedReadNotifications = localStorage.getItem(`readNotifications_${user?.id}`);
    if (storedReadNotifications) {
      setReadNotifications(JSON.parse(storedReadNotifications));
    }
    
    fetchNotifications();
    
    // Subscribe to realtime changes
    const channel = supabase
      .channel('notifications_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications' },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  useEffect(() => {
    // Count unread notifications
    setUnreadCount(notifications.filter(n => !readNotifications.includes(n.id)).length);
  }, [notifications, readNotifications]);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setNotifications(data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = (id: number) => {
    const updatedReadNotifications = [...readNotifications, id];
    setReadNotifications(updatedReadNotifications);
    localStorage.setItem(`readNotifications_${user?.id}`, JSON.stringify(updatedReadNotifications));
  };

  const markAllAsRead = () => {
    const allIds = notifications.map(n => n.id);
    setReadNotifications(allIds);
    localStorage.setItem(`readNotifications_${user?.id}`, JSON.stringify(allIds));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'academic':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'event':
        return <Calendar className="h-4 w-4 text-purple-500" />;
      case 'urgent':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative" 
          aria-label="Toggle notifications"
        >
          <BellRing className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-4 w-4 p-1 flex items-center justify-center bg-red-500 text-white text-[10px]"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="font-semibold">Notifications</h3>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs" 
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <BellRing className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p>No notifications</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => {
                const isRead = readNotifications.includes(notification.id);
                return (
                  <Card 
                    key={notification.id} 
                    className={`rounded-none p-3 ${isRead ? 'bg-background' : 'bg-primary/5'}`}
                    onClick={() => !isRead && markAsRead(notification.id)}
                  >
                    <div className="flex gap-3">
                      <div className="mt-0.5">
                        {getCategoryIcon(notification.category)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`text-sm font-medium ${!isRead ? 'font-semibold' : ''}`}>
                            {notification.title}
                          </h4>
                          <Badge 
                            variant="outline" 
                            className={`text-[10px] ${
                              notification.category === 'urgent' 
                                ? 'border-red-500 text-red-500' 
                                : notification.category === 'academic'
                                ? 'border-blue-500 text-blue-500'
                                : 'border-purple-500 text-purple-500'
                            }`}
                          >
                            {notification.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{notification.message}</p>
                        <div className="text-[10px] text-muted-foreground">
                          {formatDate(notification.created_at)}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}


import { useState, useEffect } from "react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { BellRing, PlusCircle, RefreshCw, Pencil, Trash2, Filter, Target, Clock, Users, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    category: "academic",
    audience: "all",
    startDate: new Date().toISOString().split('T')[0],
    endDate: "",
    status: "active"
  });
  
  useEffect(() => {
    fetchNotifications();
  }, []);
  
  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setNotifications(data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const addNotification = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('notifications')
        .insert({
          title: newNotification.title,
          message: newNotification.message,
          category: newNotification.category,
          audience: newNotification.audience,
          start_date: new Date(newNotification.startDate).toISOString(),
          end_date: newNotification.endDate ? new Date(newNotification.endDate).toISOString() : null,
          status: newNotification.status,
          created_by: userData?.user?.id
        });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Notification created successfully"
      });
      
      setNewNotification({
        title: "",
        message: "",
        category: "academic",
        audience: "all",
        startDate: new Date().toISOString().split('T')[0],
        endDate: "",
        status: "active"
      });
      
      fetchNotifications();
      
    } catch (error) {
      console.error("Error adding notification:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create notification",
        variant: "destructive"
      });
    }
  };
  
  const deleteNotification = async (id) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Notification deleted successfully"
      });
      
      fetchNotifications();
      
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive"
      });
    }
  };
  
  const toggleNotificationStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      
      const { error } = await supabase
        .from('notifications')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Notification ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`
      });
      
      fetchNotifications();
      
    } catch (error) {
      console.error("Error updating notification status:", error);
      toast({
        title: "Error",
        description: "Failed to update notification status",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Notification Management</h2>
          <p className="text-muted-foreground">Create and manage notifications for students</p>
        </div>
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Notification
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Notification</DialogTitle>
                <DialogDescription>Create a notification to inform students about important announcements</DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="title">Title</label>
                  <Input 
                    id="title" 
                    placeholder="Notification title" 
                    value={newNotification.title}
                    onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message">Message</label>
                  <Textarea 
                    id="message" 
                    placeholder="Notification message" 
                    rows={3}
                    value={newNotification.message}
                    onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="category">Category</label>
                    <Select
                      value={newNotification.category}
                      onValueChange={(value) => setNewNotification({...newNotification, category: value})}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="audience">Audience</label>
                    <Select
                      value={newNotification.audience}
                      onValueChange={(value) => setNewNotification({...newNotification, audience: value})}
                    >
                      <SelectTrigger id="audience">
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Students</SelectItem>
                        <SelectItem value="cs">Computer Science</SelectItem>
                        <SelectItem value="eng">Engineering</SelectItem>
                        <SelectItem value="math">Mathematics</SelectItem>
                        <SelectItem value="senior">Senior Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="startDate">Start Date</label>
                    <Input 
                      id="startDate" 
                      type="date" 
                      value={newNotification.startDate}
                      onChange={(e) => setNewNotification({...newNotification, startDate: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="endDate">End Date (Optional)</label>
                    <Input 
                      id="endDate" 
                      type="date" 
                      value={newNotification.endDate}
                      onChange={(e) => setNewNotification({...newNotification, endDate: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  type="submit" 
                  onClick={addNotification}
                  disabled={!newNotification.title || !newNotification.message}
                >
                  Create Notification
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" onClick={fetchNotifications}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Active Notifications"
          description="Currently visible"
          icon={<BellRing className="text-green-500" />}
        >
          <p className="text-3xl font-bold">
            {notifications.filter(n => n.status === 'active').length}
          </p>
          <p className="text-sm text-muted-foreground">Reaching all students</p>
        </DashboardCard>
        
        <DashboardCard
          title="Audience Reach"
          description="Target groups"
          icon={<Target className="text-blue-500" />}
        >
          <p className="text-3xl font-bold">
            {[...new Set(notifications.map(n => n.audience))].length}
          </p>
          <p className="text-sm text-muted-foreground">Unique audience groups</p>
        </DashboardCard>
        
        <DashboardCard
          title="Scheduled Notifications"
          description="Upcoming"
          icon={<Clock className="text-purple-500" />}
        >
          <p className="text-3xl font-bold">
            {notifications.filter(n => {
              const startDate = new Date(n.start_date);
              return startDate > new Date();
            }).length}
          </p>
          <p className="text-sm text-muted-foreground">Waiting to be published</p>
        </DashboardCard>
        
        <DashboardCard
          title="Global Announcements"
          description="All students"
          icon={<Globe className="text-orange-500" />}
        >
          <p className="text-3xl font-bold">
            {notifications.filter(n => n.audience === 'all').length}
          </p>
          <p className="text-sm text-muted-foreground">Campus-wide notifications</p>
        </DashboardCard>
      </div>
      
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search notifications..." className="pl-10" />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      <DashboardCard title="All Notifications">
        {isLoading ? (
          <div className="py-8 text-center">
            <p>Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <BellRing className="h-10 w-10 mx-auto mb-4 opacity-50" />
            <p>No notifications found</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell className="font-medium">{notification.title}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      notification.category === 'academic' 
                        ? "bg-blue-100 text-blue-800" 
                        : notification.category === 'urgent'
                        ? "bg-red-100 text-red-800"
                        : notification.category === 'event'
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {notification.category.charAt(0).toUpperCase() + notification.category.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>{notification.audience === 'all' ? 'All Students' : notification.audience}</TableCell>
                  <TableCell>{new Date(notification.start_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => toggleNotificationStatus(notification.id, notification.status)}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        notification.status === 'active' 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
                    </button>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DashboardCard>
    </div>
  );
}


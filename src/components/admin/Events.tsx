
import { useState, useEffect } from "react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Calendar, Clock, Users, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EventCalendar } from "./EventCalendar";

type Event = {
  id: number;
  title: string;
  type: string;
  date: Date;
  description?: string;
};

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventTitle, setEventTitle] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDateTime, setEventDateTime] = useState("");
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) throw error;
      
      setEvents(data.map(event => ({
        ...event,
        date: new Date(event.date)
      })));
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEvent = async () => {
    if (!eventTitle || !eventType || !eventDateTime) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsAddingEvent(true);
    try {
      const { error } = await supabase
        .from('events')
        .insert({
          title: eventTitle,
          type: eventType,
          date: new Date(eventDateTime).toISOString(),
          description: eventDescription || ""
        });
      
      if (error) throw error;
      
      toast({
        title: "Event added",
        description: "Event has been successfully created"
      });
      
      // Reset form and close dialog
      setEventTitle("");
      setEventType("");
      setEventDateTime("");
      setEventDescription("");
      setIsDialogOpen(false);
      
      // Refresh events list
      fetchEvents();
      
    } catch (error) {
      console.error("Error adding event:", error);
      toast({
        title: "Error",
        description: "Failed to add event",
        variant: "destructive"
      });
    } finally {
      setIsAddingEvent(false);
    }
  };

  // Count events for today
  const todayEvents = events.filter(event => 
    new Date(event.date).toDateString() === new Date().toDateString()
  );
  
  // Count upcoming events for next 7 days
  const now = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(now.getDate() + 7);
  
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= now && eventDate <= nextWeek;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Event Management</h2>
          <p className="text-muted-foreground">Organize and schedule academic events</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Calendar className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label>Event Title</label>
                <Input 
                  placeholder="Enter event title" 
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label>Event Type</label>
                <Select value={eventType} onValueChange={setEventType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exam">Examination</SelectItem>
                    <SelectItem value="seminar">Seminar</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label>Description (Optional)</label>
                <Input 
                  placeholder="Enter event description" 
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label>Date & Time</label>
                <Input 
                  type="datetime-local" 
                  value={eventDateTime}
                  onChange={(e) => setEventDateTime(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                onClick={handleAddEvent}
                disabled={isAddingEvent}
              >
                {isAddingEvent ? "Adding..." : "Add Event"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Today's Events"
          description="Scheduled for today"
          icon={<Clock className="text-blue-500" />}
        >
          <p className="text-2xl font-bold">{todayEvents.length}</p>
          <p className="text-sm text-muted-foreground">
            {todayEvents.length > 0 
              ? `${todayEvents.filter(e => e.type === 'exam').length} exams, ${todayEvents.length - todayEvents.filter(e => e.type === 'exam').length} other`
              : "No events today"}
          </p>
        </DashboardCard>

        <DashboardCard
          title="Upcoming Events"
          description="Next 7 days"
          icon={<CalendarDays className="text-purple-500" />}
        >
          <p className="text-2xl font-bold">{upcomingEvents.length}</p>
          <p className="text-sm text-muted-foreground">View calendar</p>
        </DashboardCard>

        <DashboardCard
          title="Event Attendance"
          description="Average participation"
          icon={<Users className="text-green-500" />}
        >
          <p className="text-2xl font-bold">85%</p>
          <p className="text-sm text-green-600">+5% this month</p>
        </DashboardCard>

        <DashboardCard
          title="Total Events"
          description="This semester"
          icon={<Calendar className="text-orange-500" />}
        >
          <p className="text-2xl font-bold">{events.length}</p>
          <p className="text-sm text-muted-foreground">Since start</p>
        </DashboardCard>
      </div>

      {isLoading ? (
        <DashboardCard title="Loading">
          <div className="h-[500px] flex items-center justify-center">
            <p className="text-muted-foreground">Loading event calendar...</p>
          </div>
        </DashboardCard>
      ) : (
        <EventCalendar events={events} />
      )}
    </div>
  );
}

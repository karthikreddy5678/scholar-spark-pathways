
import { useState, useEffect, useCallback } from "react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Calendar, Clock, Users, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Calendar as UICalendar } from "@/components/ui/calendar";
import { format, isSameDay, parseISO } from "date-fns";
import clsx from "clsx";

type EventType = {
  id: number;
  title: string;
  type: string;
  date: string;
  description?: string;
};

const typeColors: Record<string, string> = {
  exam: "bg-red-500",
  seminar: "bg-blue-500",
  workshop: "bg-green-500",
  default: "bg-gray-300",
};

export default function Events() {
  const [eventTitle, setEventTitle] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventDateTime, setEventDateTime] = useState("");
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [events, setEvents] = useState<EventType[]>([]);
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Fetch events for the calendar
  const fetchEvents = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });
      if (error) throw error;
      setEvents(data ?? []);
    } catch (error) {
      toast({
        title: "Error loading events",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleAddEvent = async () => {
    if (!eventTitle || !eventType || !eventDateTime) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    setIsAddingEvent(true);
    try {
      const { error } = await supabase
        .from("events")
        .insert({
          title: eventTitle,
          type: eventType,
          date: new Date(eventDateTime).toISOString(),
          description: "",
        });
      if (error) throw error;

      toast({
        title: "Event added",
        description: "Event has been successfully created",
      });

      setEventTitle("");
      setEventType("");
      setEventDateTime("");
      setIsDialogOpen(false);
      await fetchEvents(); // refresh events immediately
    } catch (error) {
      console.error("Error adding event:", error);
      toast({
        title: "Error",
        description: "Failed to add event",
        variant: "destructive",
      });
    } finally {
      setIsAddingEvent(false);
    }
  };

  // Find all events for a date
  const eventsForDate = (date: Date) =>
    events.filter((event) =>
      isSameDay(parseISO(event.date), date)
    );

  // Count events for today, upcoming week, and totals
  const today = new Date();
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(today.getDate() + 7);
  const todayEvents = events.filter((event) => isSameDay(parseISO(event.date), today));
  const upcomingEvents = events.filter((event) => {
    const d = parseISO(event.date);
    return d > today && d <= sevenDaysFromNow;
  });

  // Card helpers
  const cardSummary = (type: string) => {
    const count = todayEvents.filter(e => e.type === type).length;
    return count > 0 ? `${count} ${type}${count > 1 ? "s" : ""}` : "";
  };

  // Modern, colored Event Badge
  const EventBadge = ({ event }: { event: EventType }) => (
    <span
      className={clsx(
        "rounded px-2 py-0.5 text-xs font-semibold text-white mt-1 inline-block max-w-[110px] truncate shadow",
        typeColors[event.type] || typeColors.default
      )}
    >
      {event.title}
    </span>
  );

  // Modern Event Calendar grid decoration cell
  function CalendarDayCell(day: Date) {
    const dayEvents = eventsForDate(day);
    // If not in this month, faded
    const faded =
      day.getMonth() !== calendarMonth.getMonth();
    return (
      <div className={clsx("flex flex-col items-center justify-center h-[60px] w-full", faded && "opacity-50")}>
        <span>{day.getDate()}</span>
        <div className="flex flex-col space-y-0.5">
          {dayEvents.slice(0, 2).map((event) => (
            <EventBadge key={event.id} event={event} />
          ))}
          {dayEvents.length > 2 && (
            <span className="text-[10px] text-muted-foreground mt-1">+{dayEvents.length - 2} more</span>
          )}
        </div>
      </div>
    );
  }

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
                  </SelectContent>
                </Select>
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
            {["exam", "seminar", "workshop"]
              .map(cardSummary)
              .filter(Boolean)
              .join(", ") || "No events"}
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

      <DashboardCard title="Event Calendar">
        <div className="mx-auto w-full max-w-5xl py-4">
          <UICalendar
            month={calendarMonth}
            onMonthChange={setCalendarMonth}
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiersClassNames={{
              selected: "bg-edu-purple text-white",
              today: "border-2 border-edu-purple",
            }}
            components={{
              DayContent: ({ date }) => CalendarDayCell(date),
            }}
            className="rounded-lg bg-white shadow-none border p-4"
          />
          {selectedDate && (
            <div className="mt-3">
              <h4 className="font-semibold mb-2 flex items-center gap-1">
                <Calendar className="h-4 w-4 text-edu-purple" />
                {format(selectedDate, "PPP")}
              </h4>
              <div className="space-y-2">
                {eventsForDate(selectedDate).length === 0 ? (
                  <p className="text-sm text-muted-foreground">No events on this day.</p>
                ) : (
                  eventsForDate(selectedDate).map((event) => (
                    <div
                      key={event.id}
                      className={clsx(
                        "flex items-center gap-3 px-3 py-2 rounded-lg bg-accent border border-border shadow-sm",
                        typeColors[event.type] || typeColors.default
                      )}
                    >
                      <span className="font-medium text-white">
                        {event.title}
                      </span>
                      <span className={clsx(
                        "rounded px-1.5 py-0.5 text-xs ml-auto",
                        typeColors[event.type] || typeColors.default
                      )}>
                        {event.type}
                      </span>
                      <span className="ml-2 text-xs text-white pr-2">
                        {format(parseISO(event.date), "p")}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </DashboardCard>
    </div>
  );
}


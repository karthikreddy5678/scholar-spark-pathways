
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  BookOpen 
} from "lucide-react";

type EventType = {
  id: number;
  title: string;
  date: Date;
  type: string;
  description?: string;
};

interface CalendarDayProps {
  day: Date;
  events: EventType[];
}

// Custom component for days with events
const CalendarDay = ({ day, events }: CalendarDayProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const dayEvents = events.filter(event => 
    new Date(event.date).toDateString() === day.toDateString()
  );
  
  if (dayEvents.length === 0) return null;
  
  const getEventColor = (type: string) => {
    switch(type.toLowerCase()) {
      case 'exam': return 'bg-red-500';
      case 'seminar': return 'bg-blue-500';
      case 'workshop': return 'bg-green-500';
      case 'meeting': return 'bg-amber-500';
      default: return 'bg-purple-500';
    }
  };
  
  return (
    <>
      <div 
        className="absolute bottom-0 left-0 w-full flex justify-center"
        onClick={() => setShowDetails(true)}
      >
        <div className="flex gap-1 mb-1">
          {dayEvents.slice(0, 3).map((event, i) => (
            <div 
              key={event.id} 
              className={`w-1.5 h-1.5 rounded-full ${getEventColor(event.type)}`} 
              title={event.title}
            />
          ))}
          {dayEvents.length > 3 && (
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400" title="More events" />
          )}
        </div>
      </div>
      
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Events on {day.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {dayEvents.map(event => (
              <div 
                key={event.id}
                className="p-4 border rounded-lg shadow-sm dark:border-gray-700 transition-all hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${getEventColor(event.type)} text-white`}>
                    {event.type === 'exam' ? <BookOpen size={18} /> : 
                     event.type === 'seminar' ? <Users size={18} /> :
                     event.type === 'workshop' ? <BookOpen size={18} /> :
                     <CalendarIcon size={18} />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{event.title}</h4>
                    {event.description && <p className="text-sm text-muted-foreground mt-1">{event.description}</p>}
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock size={14} className="mr-1" />
                        {new Date(event.date).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <MapPin size={14} className="mr-1" />
                        Campus
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const EventCalendar = ({ events }: { events: EventType[] }) => {
  const [date, setDate] = useState<Date>(new Date());
  
  // Function to modify day rendering in the calendar
  const modifiers = {
    eventDays: events.map(event => new Date(event.date))
  };
  
  const modifiersClassNames = {
    eventDays: "relative"
  };

  return (
    <DashboardCard title="Event Calendar" className="py-4">
      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => date && setDate(date)}
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
          className="rounded-md border"
          components={{
            Day: ({ date: dayDate, ...props }) => (
              <div className="relative">
                {props.children}
                <CalendarDay 
                  day={dayDate}
                  events={events}
                />
              </div>
            )
          }}
        />
      </div>
    </DashboardCard>
  );
};

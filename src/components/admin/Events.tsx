
import { useState } from "react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Calendar, Clock, Users, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Events() {
  const [selectedDate] = useState<Date>(new Date());

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Event Management</h2>
          <p className="text-muted-foreground">Organize and schedule academic events</p>
        </div>
        <Dialog>
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
                <Input placeholder="Enter event title" />
              </div>
              <div className="space-y-2">
                <label>Event Type</label>
                <Select>
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
                <Input type="datetime-local" />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Today's Events"
          description="Scheduled for today"
          icon={<Clock className="text-blue-500" />}
        >
          <p className="text-2xl font-bold">3</p>
          <p className="text-sm text-muted-foreground">2 exams, 1 seminar</p>
        </DashboardCard>

        <DashboardCard
          title="Upcoming Events"
          description="Next 7 days"
          icon={<CalendarDays className="text-purple-500" />}
        >
          <p className="text-2xl font-bold">8</p>
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
          <p className="text-2xl font-bold">42</p>
          <p className="text-sm text-muted-foreground">Since start</p>
        </DashboardCard>
      </div>

      {/* Calendar will be implemented here */}
      <DashboardCard title="Event Calendar">
        <div className="h-[500px] flex items-center justify-center border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">Calendar Component Coming Soon</p>
        </div>
      </DashboardCard>
    </div>
  );
}

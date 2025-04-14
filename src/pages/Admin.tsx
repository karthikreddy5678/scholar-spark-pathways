
import { useState } from "react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { 
  UserRound, ClipboardList, BookOpen, Trophy, 
  BellRing, BarChart2, CalendarDays, FileText, 
  Settings, Users, Search, LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Mock data for recent students
  const recentStudents = [
    { id: "STU-1001", name: "Emma Johnson", course: "Computer Science", status: "Active" },
    { id: "STU-1042", name: "Michael Chen", course: "Data Science", status: "Active" },
    { id: "STU-0987", name: "Sarah Williams", course: "Engineering", status: "On Leave" },
    { id: "STU-1123", name: "James Rodriguez", course: "Physics", status: "Active" },
    { id: "STU-0765", name: "Priya Patel", course: "Mathematics", status: "Inactive" },
  ];

  // Mock data for upcoming events
  const upcomingEvents = [
    { id: 1, title: "Final Exam: Database Systems", date: "May 20, 2025", type: "Exam" },
    { id: 2, title: "Faculty Meeting", date: "May 15, 2025", type: "Meeting" },
    { id: 3, title: "AI Workshop for Students", date: "May 18, 2025", type: "Workshop" },
  ];

  // Handle logout
  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-sidebar border-r border-border hidden md:block">
        <div className="flex items-center justify-center h-16 border-b border-border">
          <div className="flex items-center">
            <Settings className="h-6 w-6 text-edu-purple mr-2" />
            <h1 className="text-xl font-semibold text-foreground">Admin Panel</h1>
          </div>
        </div>
        <nav className="mt-6">
          <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">
            Main
          </div>
          <button 
            className={`w-full flex items-center px-4 py-2.5 text-sm font-medium ${activeTab === "dashboard" ? "bg-edu-purple/10 text-edu-purple border-r-2 border-edu-purple" : "text-foreground hover:bg-accent"}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <BarChart2 className="h-4 w-4 mr-3" />
            Dashboard
          </button>
          <button 
            className={`w-full flex items-center px-4 py-2.5 text-sm font-medium ${activeTab === "students" ? "bg-edu-purple/10 text-edu-purple border-r-2 border-edu-purple" : "text-foreground hover:bg-accent"}`}
            onClick={() => setActiveTab("students")}
          >
            <Users className="h-4 w-4 mr-3" />
            Students
          </button>
          <button 
            className={`w-full flex items-center px-4 py-2.5 text-sm font-medium ${activeTab === "grades" ? "bg-edu-purple/10 text-edu-purple border-r-2 border-edu-purple" : "text-foreground hover:bg-accent"}`}
            onClick={() => setActiveTab("grades")}
          >
            <ClipboardList className="h-4 w-4 mr-3" />
            Grades
          </button>
          <button 
            className={`w-full flex items-center px-4 py-2.5 text-sm font-medium ${activeTab === "courses" ? "bg-edu-purple/10 text-edu-purple border-r-2 border-edu-purple" : "text-foreground hover:bg-accent"}`}
            onClick={() => setActiveTab("courses")}
          >
            <BookOpen className="h-4 w-4 mr-3" />
            Courses
          </button>
          <button 
            className={`w-full flex items-center px-4 py-2.5 text-sm font-medium ${activeTab === "leaderboard" ? "bg-edu-purple/10 text-edu-purple border-r-2 border-edu-purple" : "text-foreground hover:bg-accent"}`}
            onClick={() => setActiveTab("leaderboard")}
          >
            <Trophy className="h-4 w-4 mr-3" />
            Leaderboard
          </button>
          <button 
            className={`w-full flex items-center px-4 py-2.5 text-sm font-medium ${activeTab === "analytics" ? "bg-edu-purple/10 text-edu-purple border-r-2 border-edu-purple" : "text-foreground hover:bg-accent"}`}
            onClick={() => setActiveTab("analytics")}
          >
            <BarChart2 className="h-4 w-4 mr-3" />
            Analytics
          </button>
          <button 
            className={`w-full flex items-center px-4 py-2.5 text-sm font-medium ${activeTab === "events" ? "bg-edu-purple/10 text-edu-purple border-r-2 border-edu-purple" : "text-foreground hover:bg-accent"}`}
            onClick={() => setActiveTab("events")}
          >
            <CalendarDays className="h-4 w-4 mr-3" />
            Events
          </button>
          <button 
            className={`w-full flex items-center px-4 py-2.5 text-sm font-medium ${activeTab === "notifications" ? "bg-edu-purple/10 text-edu-purple border-r-2 border-edu-purple" : "text-foreground hover:bg-accent"}`}
            onClick={() => setActiveTab("notifications")}
          >
            <BellRing className="h-4 w-4 mr-3" />
            Notifications
          </button>
          <button 
            className={`w-full flex items-center px-4 py-2.5 text-sm font-medium ${activeTab === "reports" ? "bg-edu-purple/10 text-edu-purple border-r-2 border-edu-purple" : "text-foreground hover:bg-accent"}`}
            onClick={() => setActiveTab("reports")}
          >
            <FileText className="h-4 w-4 mr-3" />
            Reports
          </button>

          <div className="absolute bottom-0 w-64 border-t border-border p-4">
            <Button 
              variant="outline" 
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navbar */}
        <header className="bg-background border-b border-border h-16 flex items-center justify-between px-6">
          <div className="flex items-center">
            <button className="md:hidden mr-4">
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                <path d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"></path>
              </svg>
            </button>
            <h1 className="text-xl font-bold">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          </div>
          <div className="flex items-center">
            <div className="relative w-64 mr-4">
              <Input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
            <button className="mr-4 relative">
              <BellRing className="h-6 w-6" />
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-edu-red"></span>
            </button>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-edu-purple rounded-full flex items-center justify-center text-white font-semibold mr-2">
                A
              </div>
              <span className="font-medium text-sm">Admin</span>
            </div>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-6 bg-background/50">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <DashboardCard
                  title="Total Students"
                  description="Currently registered"
                  icon={<UserRound />}
                >
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bold">2,845</p>
                      <p className="text-sm text-green-600">+14% from last semester</p>
                    </div>
                  </div>
                </DashboardCard>

                <DashboardCard
                  title="Active Courses"
                  description="Current semester"
                  icon={<BookOpen />}
                >
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bold">137</p>
                      <p className="text-sm text-muted-foreground">Across 12 departments</p>
                    </div>
                  </div>
                </DashboardCard>

                <DashboardCard
                  title="Grade Submissions"
                  description="This week"
                  icon={<ClipboardList />}
                >
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bold">86%</p>
                      <p className="text-sm text-amber-600">14% pending</p>
                    </div>
                  </div>
                </DashboardCard>

                <DashboardCard
                  title="Upcoming Events"
                  description="Next 7 days"
                  icon={<CalendarDays />}
                >
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bold">8</p>
                      <p className="text-sm text-muted-foreground">3 exams, 5 other</p>
                    </div>
                  </div>
                </DashboardCard>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <DashboardCard
                  title="Recent Students"
                  description="Newly registered"
                  icon={<Users />}
                >
                  <div className="mt-2">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentStudents.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">{student.id}</TableCell>
                            <TableCell>{student.name}</TableCell>
                            <TableCell>{student.course}</TableCell>
                            <TableCell>
                              <span 
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  student.status === "Active" 
                                    ? "bg-green-100 text-green-800" 
                                    : student.status === "On Leave"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {student.status}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="mt-4">
                      <Button variant="outline" size="sm" className="w-full">View All Students</Button>
                    </div>
                  </div>
                </DashboardCard>

                <DashboardCard
                  title="Upcoming Events"
                  description="Schedule for the week"
                  icon={<CalendarDays />}
                >
                  <div className="space-y-4 mt-2">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="flex items-start space-x-3 border-b border-border pb-3 last:border-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          event.type === "Exam" 
                            ? "bg-red-100 text-red-800" 
                            : event.type === "Meeting"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}>
                          {event.type === "Exam" ? "E" : event.type === "Meeting" ? "M" : "W"}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-muted-foreground">{event.date}</p>
                          <p className="text-xs text-muted-foreground mt-1">{event.type}</p>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full">Manage Calendar</Button>
                  </div>
                </DashboardCard>
              </div>

              <DashboardCard
                title="Quick Actions"
                description="Frequently used tasks"
              >
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-2">
                  <Button variant="outline" className="h-auto py-4 flex flex-col">
                    <UserRound className="h-6 w-6 mb-2" />
                    <span>Add Student</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex flex-col">
                    <BookOpen className="h-6 w-6 mb-2" />
                    <span>New Course</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex flex-col">
                    <ClipboardList className="h-6 w-6 mb-2" />
                    <span>Grade Entry</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex flex-col">
                    <BellRing className="h-6 w-6 mb-2" />
                    <span>Send Notice</span>
                  </Button>
                </div>
              </DashboardCard>
            </div>
          )}

          {activeTab !== "dashboard" && (
            <div className="rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
              <h2 className="text-2xl font-bold mb-6">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module</h2>
              <p className="text-muted-foreground">This {activeTab} module is currently under development. Please check back soon.</p>
              <Button className="mt-4 bg-edu-purple hover:bg-edu-purple-dark">
                Back to Dashboard
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

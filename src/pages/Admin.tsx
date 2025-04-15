import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  UserRound, ClipboardList, BookOpen, Trophy, BellRing, 
  BarChart2, CalendarDays, FileText, Settings, Users, 
  Search, LogOut, Grid, PlusCircle, Pencil, Trash2, Filter,
  Upload, Download, Clock, Lock, AlertCircle, Calendar,
  GanttChartSquare, GraduationCap, CreditCard, FileOutput,
  UnlockIcon
} from "lucide-react";
import Leaderboard from "@/components/admin/Leaderboard";
import Analytics from "@/components/admin/Analytics";
import Events from "@/components/admin/Events";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

export default function Admin() {
  const navigate = useNavigate();
  const { isAdmin, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  
  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, navigate]);

  const recentStudents = [
    { id: "STU-1001", name: "Emma Johnson", course: "Computer Science", status: "Active" },
    { id: "STU-1042", name: "Michael Chen", course: "Data Science", status: "Active" },
    { id: "STU-0987", name: "Sarah Williams", course: "Engineering", status: "On Leave" },
    { id: "STU-1123", name: "James Rodriguez", course: "Physics", status: "Active" },
    { id: "STU-0765", name: "Priya Patel", course: "Mathematics", status: "Inactive" },
  ];

  const upcomingEvents = [
    { id: 1, title: "Final Exam: Database Systems", date: "May 20, 2025", type: "Exam" },
    { id: 2, title: "Faculty Meeting", date: "May 15, 2025", type: "Meeting" },
    { id: 3, title: "AI Workshop for Students", date: "May 18, 2025", type: "Workshop" },
  ];

  const gradesData = [
    { id: 1, course: "Algorithms", students: 45, submitted: 42, pending: 3, locked: true },
    { id: 2, course: "Database Systems", students: 38, submitted: 38, pending: 0, locked: true },
    { id: 3, course: "Machine Learning", students: 50, submitted: 35, pending: 15, locked: false },
    { id: 4, course: "Web Development", students: 42, submitted: 40, pending: 2, locked: false },
  ];

  const coursesData = [
    { id: "CS301", title: "Advanced Algorithms", credits: 4, professor: "Dr. Jane Smith", semester: "Fall" },
    { id: "CS401", title: "Machine Learning", credits: 3, professor: "Dr. Mike Johnson", semester: "Spring" },
    { id: "CS201", title: "Database Systems", credits: 4, professor: "Dr. Sarah Lee", semester: "Fall" },
    { id: "CS101", title: "Introduction to Programming", credits: 3, professor: "Dr. Robert Chen", semester: "Both" },
  ];

  const notificationsData = [
    { id: 1, title: "Exam Announcement", category: "Academic", audience: "All Students", date: "May 5, 2025", status: "Active" },
    { id: 2, title: "Campus Event", category: "General", audience: "Computer Science", date: "May 12, 2025", status: "Scheduled" },
    { id: 3, title: "Submission Deadline", category: "Academic", audience: "Senior Year", date: "May 7, 2025", status: "Active" },
  ];

  const toggleLockStatus = (gradeId: number) => {
    toast({
      title: "Grade status updated",
      description: "Grade lock status has been updated successfully."
    });
  };

  return (
    <div className="flex h-screen bg-background">
      <div className="w-64 bg-sidebar border-r border-border hidden md:block">
        <div className="flex items-center justify-center h-16 border-b border-border">
          <div className="flex items-center">
            <Settings className="h-6 w-6 text-edu-purple mr-2" />
            <h1 className="text-xl font-semibold text-foreground">Admin Panel</h1>
          </div>
        </div>
        <nav className="mt-6 flex flex-col h-[calc(100%-4rem)]">
          <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">
            Main
          </div>
          <button 
            className={`w-full flex items-center px-4 py-2.5 text-sm font-medium ${activeTab === "dashboard" ? "bg-edu-purple/10 text-edu-purple border-r-2 border-edu-purple" : "text-foreground hover:bg-accent"}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <Grid className="h-4 w-4 mr-3" />
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

          <div className="mt-auto border-t border-border p-4">
            <Button 
              variant="outline" 
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={signOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </nav>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
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
                P
              </div>
              <span className="font-medium text-sm">Professor</span>
            </div>
          </div>
        </header>

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
                      <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("students")}>
                        View All Students
                      </Button>
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
                    <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("events")}>
                      Manage Calendar
                    </Button>
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

          {activeTab === "students" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Student Management</h2>
                  <p className="text-muted-foreground">View and manage student profiles</p>
                </div>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Student
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Student</DialogTitle>
                        <DialogDescription>Enter student details below to create a new profile.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="name" className="text-right">Full Name</label>
                          <Input id="name" placeholder="John Doe" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="email" className="text-right">Email</label>
                          <Input id="email" placeholder="john@university.edu" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="id" className="text-right">Student ID</label>
                          <Input id="id" placeholder="STU-1234" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="course" className="text-right">Course</label>
                          <Select>
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select course" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cs">Computer Science</SelectItem>
                              <SelectItem value="eng">Engineering</SelectItem>
                              <SelectItem value="math">Mathematics</SelectItem>
                              <SelectItem value="phys">Physics</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" onClick={() => toast.success("Student added successfully")}>
                          Save Student
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Import CSV
                  </Button>
                  
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search students..." className="pl-10" />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              
              <DashboardCard title="Student List">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.id}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.course}</TableCell>
                        <TableCell>
                          <Select defaultValue={student.status.toLowerCase()}>
                            <SelectTrigger className="w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="on leave">On Leave</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </DashboardCard>
            </div>
          )}

          {activeTab === "grades" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Grade Management</h2>
                  <p className="text-muted-foreground">Manage and track student grades</p>
                </div>
                <div className="flex space-x-2">
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Grade Entry
                  </Button>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <DashboardCard
                  title="Pending Grades"
                  description="Need submission"
                  icon={<Clock className="text-amber-500" />}
                >
                  <p className="text-3xl font-bold">20</p>
                  <p className="text-sm text-muted-foreground">Across 4 courses</p>
                </DashboardCard>
                
                <DashboardCard
                  title="Locked Grades"
                  description="Finalized & submitted"
                  icon={<Lock className="text-green-500" />}
                >
                  <p className="text-3xl font-bold">156</p>
                  <p className="text-sm text-muted-foreground">No changes allowed</p>
                </DashboardCard>
                
                <DashboardCard
                  title="Grade Appeals"
                  description="Under review"
                  icon={<AlertCircle className="text-red-500" />}
                >
                  <p className="text-3xl font-bold">8</p>
                  <p className="text-sm text-muted-foreground">Requires attention</p>
                </DashboardCard>
                
                <DashboardCard
                  title="Upcoming Deadlines"
                  description="Grade submission"
                  icon={<Calendar className="text-blue-500" />}
                >
                  <p className="text-3xl font-bold">2</p>
                  <p className="text-sm text-muted-foreground">Next: May 15, 2025</p>
                </DashboardCard>
              </div>
              
              <DashboardCard title="Course Grade Status">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Pending</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gradesData.map((grade) => (
                      <TableRow key={grade.id}>
                        <TableCell className="font-medium">{grade.course}</TableCell>
                        <TableCell>{grade.students}</TableCell>
                        <TableCell>{grade.submitted}</TableCell>
                        <TableCell>{grade.pending}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            grade.locked 
                              ? "bg-green-100 text-green-800" 
                              : "bg-amber-100 text-amber-800"
                          }`}>
                            {grade.locked ? "Locked" : "Open"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => toggleLockStatus(grade.id)}>
                              {grade.locked ? 
                                <><UnlockIcon className="mr-2 h-4 w-4" /> Unlock</> : 
                                <><Lock className="mr-2 h-4 w-4" /> Lock</>
                              }
                            </Button>
                            <Button variant="outline" size="sm">
                              <Pencil className="mr-2 h-4 w-4" /> Edit
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </DashboardCard>
            </div>
          )}

          {activeTab === "courses" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Course Management</h2>
                  <p className="text-muted-foreground">Create and manage courses</p>
                </div>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Course
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Course</DialogTitle>
                        <DialogDescription>Enter course details to create a new course.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="course-id" className="text-right">Course ID</label>
                          <Input id="course-id" placeholder="CS101" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="course-title" className="text-right">Title</label>
                          <Input id="course-title" placeholder="Introduction to Programming" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="credits" className="text-right">Credits</label>
                          <Input id="credits" placeholder="3" type="number" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="professor" className="text-right">Professor</label>
                          <Select>
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select professor" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="js">Dr. Jane Smith</SelectItem>
                              <SelectItem value="mj">Dr. Mike Johnson</SelectItem>
                              <SelectItem value="sl">Dr. Sarah Lee</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="semester" className="text-right">Semester</label>
                          <Select>
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select semester" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fall">Fall</SelectItem>
                              <SelectItem value="spring">Spring</SelectItem>
                              <SelectItem value="both">Both</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" onClick={() => toast.success("Course added successfully")}>
                          Save Course
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <DashboardCard
                  title="Active Courses"
                  description="Current semester"
                  icon={<BookOpen className="text-edu-purple" />}
                >
                  <p className="text-3xl font-bold">137</p>
                </DashboardCard>
                
                <DashboardCard
                  title="Departments"
                  description="Offering courses"
                  icon={<GanttChartSquare className="text-edu-purple" />}
                >
                  <p className="text-3xl font-bold">12</p>
                </DashboardCard>
                
                <DashboardCard
                  title="Professors"
                  description="Teaching staff"
                  icon={<GraduationCap className="text-edu-purple" />}
                >
                  <p className="text-3xl font-bold">67</p>
                </DashboardCard>
                
                <DashboardCard
                  title="Credit Hours"
                  description="Total offered"
                  icon={<CreditCard className="text-edu-purple" />}
                >
                  <p className="text-3xl font-bold">412</p>
                </DashboardCard>
              </div>
              
              <Tabs defaultValue="active">
                <TabsList>
                  <TabsTrigger value="active">Active Courses</TabsTrigger>
                  <TabsTrigger value="archived">Archived Courses</TabsTrigger>
                  <TabsTrigger value="upcoming">Upcoming Courses</TabsTrigger>
                </TabsList>
                
                <TabsContent value="active" className="mt-4">
                  <DashboardCard title="Active Courses">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Course ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Credits</TableHead>
                          <TableHead>Professor</TableHead>
                          <TableHead>Semester</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {coursesData.map((course) => (
                          <TableRow key={course.id}>
                            <TableCell className="font-medium">{course.id}</TableCell>
                            <TableCell>{course.title}</TableCell>
                            <TableCell>{course.credits}</TableCell>
                            <TableCell>{course.professor}</TableCell>
                            <TableCell>{course.semester}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="icon">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </DashboardCard>
                </TabsContent>
                
                <TabsContent value="archived" className="mt-4">
                  <DashboardCard title="Archived Courses">
                    <div className="py-8 text-center text-muted-foreground">
                      <FileOutput className="h-10 w-10 mx-auto mb-4 opacity-50" />
                      <p>No archived courses found</p>
                    </div>
                  </DashboardCard>
                </TabsContent>
                
                <TabsContent value="upcoming" className="mt-4">
                  <DashboardCard title="Upcoming Courses">
                    <div className="py-8 text-center text-muted-foreground">
                      <CalendarDays className="h-10 w-10 mx-auto mb-4 opacity-50" />
                      <p>No upcoming courses scheduled</p>
                      <Button variant="outline" size="sm" className="mt-4">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Schedule New Course
                      </Button>
                    </div>
                  </DashboardCard>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {activeTab === "leaderboard" && <Leaderboard />}
          {activeTab === "analytics" && <Analytics />}
          {activeTab === "events" && <Events />}
        </main>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  UserRound, ClipboardList, BookOpen, Trophy, BellRing, 
  BarChart2, CalendarDays, FileText, Settings, Users, 
  Search, LogOut, Grid, PlusCircle, Pencil, Trash2, Filter,
  Upload, Download, Clock, Lock, AlertCircle, Calendar,
  GanttChartSquare, GraduationCap, CreditCard, FileOutput,
  UnlockIcon, RefreshCw
} from "lucide-react";
import Leaderboard from "@/components/admin/Leaderboard";
import Analytics from "@/components/admin/Analytics";
import Events from "@/components/admin/Events";
import Notifications from "@/components/admin/Notifications";
import Reports from "@/components/admin/Reports";
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
  
  const [newStudent, setNewStudent] = useState({
    email: "",
    fullName: "",
    course: "",
    status: "active"
  });
  
  const [newCourse, setNewCourse] = useState({
    courseId: "",
    title: "",
    credits: 3,
    professor: "",
    semester: "fall"
  });
  
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [gradesData, setGradesData] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalStudents: 0,
    activeCourses: 0,
    gradeSubmissionPercentage: 0,
    upcomingEvents: 0
  });
  
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [isLoadingGrades, setIsLoadingGrades] = useState(false);
  
  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
    } else {
      fetchDashboardStats();
      if (activeTab === "students") {
        fetchStudents();
      } else if (activeTab === "courses") {
        fetchCourses();
      } else if (activeTab === "grades") {
        fetchGrades();
      }
    }
  }, [isAdmin, navigate, activeTab]);

  const fetchDashboardStats = async () => {
    try {
      const { count: studentCount, error: studentError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student');
      
      if (studentError) throw studentError;
      
      const { count: courseCount, error: courseError } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true });
      
      if (courseError) throw courseError;
      
      const { data: gradesData, error: gradesError } = await supabase
        .from('grades')
        .select('locked');
      
      if (gradesError) throw gradesError;
      
      const totalGrades = gradesData?.length || 0;
      const lockedGrades = gradesData?.filter(g => g.locked).length || 0;
      const submissionPercentage = totalGrades > 0 
        ? Math.round((lockedGrades / totalGrades) * 100) 
        : 0;
      
      const now = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(now.getDate() + 7);
      
      const { count: eventsCount, error: eventsError } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .gte('date', now.toISOString())
        .lt('date', nextWeek.toISOString());
      
      if (eventsError) throw eventsError;
      
      setDashboardStats({
        totalStudents: studentCount || 0,
        activeCourses: courseCount || 0,
        gradeSubmissionPercentage: submissionPercentage,
        upcomingEvents: eventsCount || 0
      });
      
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      toast({
        title: "Error fetching statistics",
        description: "Could not load dashboard data",
        variant: "destructive"
      });
    }
  };

  const fetchStudents = async () => {
    setIsLoadingStudents(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student');
      
      if (error) throw error;
      
      const formattedStudents = data.map(student => ({
        id: student.id,
        name: `${student.first_name || ''} ${student.last_name || ''}`.trim(),
        email: student.email,
        course: "N/A",
        status: "active"
      }));
      
      setStudents(formattedStudents);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast({
        title: "Error",
        description: "Failed to load student data",
        variant: "destructive"
      });
    } finally {
      setIsLoadingStudents(false);
    }
  };

  const fetchCourses = async () => {
    setIsLoadingCourses(true);
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          profiles:professor_id(first_name, last_name)
        `);
      
      if (error) throw error;
      
      const formattedCourses = data.map(course => ({
        id: course.course_id,
        title: course.title,
        credits: course.credits,
        professor: course.profiles 
          ? `Dr. ${course.profiles.first_name || ''} ${course.profiles.last_name || ''}`.trim()
          : "Unassigned",
        semester: course.semester
      }));
      
      setCourses(formattedCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast({
        title: "Error",
        description: "Failed to load course data",
        variant: "destructive"
      });
    } finally {
      setIsLoadingCourses(false);
    }
  };

  const fetchGrades = async () => {
    setIsLoadingGrades(true);
    try {
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('id, title');
      
      if (coursesError) throw coursesError;
      
      const gradesPromises = coursesData.map(async (course) => {
        const totalStudents = 30 + Math.floor(Math.random() * 20);
        
        const { data: gradeData, error: gradeError } = await supabase
          .from('grades')
          .select('*')
          .eq('course_id', course.id)
          .eq('locked', true);
        
        if (gradeError) throw gradeError;
        
        const submitted = gradeData?.length || 0;
        
        return {
          id: course.id,
          course: course.title,
          students: totalStudents,
          submitted: submitted,
          pending: totalStudents - submitted,
          locked: submitted === totalStudents
        };
      });
      
      const gradesResult = await Promise.all(gradesPromises);
      setGradesData(gradesResult);
      
    } catch (error) {
      console.error("Error fetching grades:", error);
      toast({
        title: "Error",
        description: "Failed to load grade data",
        variant: "destructive"
      });
    } finally {
      setIsLoadingGrades(false);
    }
  };

  const addStudent = async () => {
    setIsAddingStudent(true);
    try {
      const nameParts = newStudent.fullName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      const { data: userData, error: userError } = await supabase.auth.admin.createUser({
        email: newStudent.email,
        password: "password123",
        email_confirm: true,
        user_metadata: { 
          full_name: newStudent.fullName,
          role: 'student'
        }
      });
      
      if (userError) throw userError;
      
      if (userData?.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: userData.user.id,
            email: newStudent.email,
            first_name: firstName,
            last_name: lastName,
            role: 'student'
          });
        
        if (profileError) throw profileError;
      }
      
      toast({
        title: "Success",
        description: "Student added successfully"
      });
      
      setNewStudent({
        email: "",
        fullName: "",
        course: "",
        status: "active"
      });
      
      fetchStudents();
      fetchDashboardStats();
      
    } catch (error) {
      console.error("Error adding student:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add student",
        variant: "destructive"
      });
    } finally {
      setIsAddingStudent(false);
    }
  };

  const addCourse = async () => {
    setIsAddingCourse(true);
    try {
      const { data: professorData, error: professorError } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'professor')
        .ilike('last_name', `%${newCourse.professor.split(' ').pop()}%`)
        .limit(1);
      
      if (professorError) throw professorError;
      
      const professorId = professorData?.length > 0 ? professorData[0].id : null;
      
      const { error } = await supabase
        .from('courses')
        .insert({
          course_id: newCourse.courseId,
          title: newCourse.title,
          credits: parseInt(newCourse.credits),
          professor_id: professorId,
          semester: newCourse.semester
        });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Course added successfully"
      });
      
      setNewCourse({
        courseId: "",
        title: "",
        credits: 3,
        professor: "",
        semester: "fall"
      });
      
      fetchCourses();
      fetchDashboardStats();
      
    } catch (error) {
      console.error("Error adding course:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add course",
        variant: "destructive"
      });
    } finally {
      setIsAddingCourse(false);
    }
  };

  const toggleLockStatus = async (gradeId) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('grades')
        .select('locked')
        .eq('course_id', gradeId.toString())
        .single();
      
      if (fetchError) throw fetchError;
      
      const newLockStatus = !data.locked;
      
      const { error: updateError } = await supabase
        .from('grades')
        .update({ locked: newLockStatus })
        .eq('course_id', gradeId.toString());
      
      if (updateError) throw updateError;
      
      toast({
        title: "Grade status updated",
        description: `Grades are now ${newLockStatus ? 'locked' : 'unlocked'}`
      });
      
      fetchGrades();
      
    } catch (error) {
      console.error("Error toggling grade lock status:", error);
      toast({
        title: "Error",
        description: "Failed to update grade status",
        variant: "destructive"
      });
    }
  };

  const deleteStudent = async (studentId) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(studentId);
      
      if (error) throw error;
      
      toast({
        title: "Student removed",
        description: "Student has been deleted from the system"
      });
      
      fetchStudents();
      fetchDashboardStats();
      
    } catch (error) {
      console.error("Error deleting student:", error);
      toast({
        title: "Error",
        description: "Failed to delete student",
        variant: "destructive"
      });
    }
  };

  const deleteCourse = async (courseId) => {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('course_id', courseId);
      
      if (error) throw error;
      
      toast({
        title: "Course removed",
        description: "Course has been deleted from the system"
      });
      
      fetchCourses();
      fetchDashboardStats();
      
    } catch (error) {
      console.error("Error deleting course:", error);
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive"
      });
    }
  };

  const getRecentStudents = () => {
    return students.slice(0, 5);
  };

  const upcomingEvents = [
    { id: 1, title: "Final Exam: Database Systems", date: "May 20, 2025", type: "Exam" },
    { id: 2, title: "Faculty Meeting", date: "May 15, 2025", type: "Meeting" },
    { id: 3, title: "AI Workshop for Students", date: "May 18, 2025", type: "Workshop" },
  ];

  const handleNewGradeEntry = () => {
    setActiveTab("new-grade");
    toast({
      title: "Grade Entry Form Opened",
      description: "You can now enter grades for students"
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
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Dashboard Overview</h2>
                <Button variant="outline" className="flex items-center" onClick={fetchDashboardStats}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Data
                </Button>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <DashboardCard
                  title="Total Students"
                  description="Currently registered"
                  icon={<UserRound />}
                >
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bold">{dashboardStats.totalStudents}</p>
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
                      <p className="text-3xl font-bold">{dashboardStats.activeCourses}</p>
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
                      <p className="text-3xl font-bold">{dashboardStats.gradeSubmissionPercentage}%</p>
                      <p className="text-sm text-amber-600">{100 - dashboardStats.gradeSubmissionPercentage}% pending</p>
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
                      <p className="text-3xl font-bold">{dashboardStats.upcomingEvents}</p>
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
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getRecentStudents().map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">{student.id.substring(0, 8)}...</TableCell>
                            <TableCell>{student.name}</TableCell>
                            <TableCell>{student.email}</TableCell>
                            <TableCell>
                              <span 
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  student.status === "active" 
                                    ? "bg-green-100 text-green-800" 
                                    : student.status === "on leave"
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
                  <Button variant="outline" className="h-auto py-4 flex flex-col" onClick={() => setActiveTab("students")}>
                    <UserRound className="h-6 w-6 mb-2" />
                    <span>Add Student</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex flex-col" onClick={() => setActiveTab("courses")}>
                    <BookOpen className="h-6 w-6 mb-2" />
                    <span>New Course</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex flex-col" onClick={() => setActiveTab("grades")}>
                    <ClipboardList className="h-6 w-6 mb-2" />
                    <span>Grade Entry</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex flex-col" onClick={() => setActiveTab("notifications")}>
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
                          <Input 
                            id="name" 
                            placeholder="John Doe" 
                            className="col-span-3"
                            value={newStudent.fullName}
                            onChange={(e) => setNewStudent({...newStudent, fullName: e.target.value})}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="email" className="text-right">Email</label>
                          <Input 
                            id="email" 
                            placeholder="john@university.edu" 
                            className="col-span-3"
                            value={newStudent.email}
                            onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="course" className="text-right">Course</label>
                          <Select 
                            value={newStudent.course}
                            onValueChange={(value) => setNewStudent({...newStudent, course: value})}
                          >
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
                        <Button 
                          type="submit" 
                          onClick={addStudent}
                          disabled={isAddingStudent || !newStudent.email || !newStudent.fullName}
                        >
                          {isAddingStudent ? "Adding..." : "Save Student"}
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
                <Button variant="outline" size="icon" onClick={fetchStudents}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              
              <DashboardCard title="Student List">
                {isLoadingStudents ? (
                  <div className="py-8 text-center">
                    <p>Loading students...</p>
                  </div>
                ) : students.length === 0 ? (
                  <div className="py-8 text-center">
                    <p>No students found</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.id.substring(0, 8)}...</TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell>
                            <Select defaultValue={student.status}>
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
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-destructive"
                                onClick={() => deleteStudent(student.id)}
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
          )}

          {activeTab === "grades" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Grade Management</h2>
                  <p className="text-muted-foreground">Manage and track student grades</p>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleNewGradeEntry}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Grade Entry
                  </Button>
                  <Button variant="outline" onClick={fetchGrades}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <DashboardCard
                  title="Pending Grades"
                  description="Need submission"
                  icon={<Clock className="text-amber-500" />}
                >
                  <p className="text-3xl font-bold">
                    {gradesData.reduce((acc, grade) => acc + grade.pending, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Across {gradesData.filter(g => g.pending > 0).length} courses
                  </p>
                </DashboardCard>
                
                <DashboardCard
                  title="Locked Grades"
                  description="Finalized & submitted"
                  icon={<Lock className="text-green-500" />}
                >
                  <p className="text-3xl font-bold">
                    {gradesData.reduce((acc, grade) => acc + grade.submitted, 0)}
                  </p>
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
                {isLoadingGrades ? (
                  <div className="py-8 text-center">
                    <p>Loading grade data...</p>
                  </div>
                ) : gradesData.length === 0 ? (
                  <div className="py-8 text-center">
                    <p>No grade data available</p>
                  </div>
                ) : (
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
                )}
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
                          <Input 
                            id="course-id" 
                            placeholder="CS101" 
                            className="col-span-3"
                            value={newCourse.courseId}
                            onChange={(e) => setNewCourse({...newCourse, courseId: e.target.value})}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="course-title" className="text-right">Title</label>
                          <Input 
                            id="course-title" 
                            placeholder="Introduction to Programming" 
                            className="col-span-3"
                            value={newCourse.title}
                            onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="credits" className="text-right">Credits</label>
                          <Input 
                            id="credits" 
                            placeholder="3" 
                            type="number" 
                            className="col-span-3"
                            value={newCourse.credits.toString()}
                            onChange={(e) => setNewCourse({...newCourse, credits: parseInt(e.target.value) || 0})}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="professor" className="text-right">Professor</label>
                          <Select
                            value={newCourse.professor}
                            onValueChange={(value) => setNewCourse({...newCourse, professor: value})}
                          >
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
                          <Select
                            value={newCourse.semester}
                            onValueChange={(value) => setNewCourse({...newCourse, semester: value})}
                          >
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
                        <Button 
                          type="submit" 
                          onClick={addCourse}
                          disabled={isAddingCourse || !newCourse.courseId || !newCourse.title}
                        >
                          {isAddingCourse ? "Adding..." : "Save Course"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <Button variant="outline" onClick={fetchCourses}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                </div>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <DashboardCard
                  title="Active Courses"
                  description="Current semester"
                  icon={<BookOpen className="text-edu-purple" />}
                >
                  <p className="text-3xl font-bold">{courses.length}</p>
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
                  <p className="text-3xl font-bold">
                    {courses.reduce((total, course) => total + parseInt(course.credits), 0)}
                  </p>
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
                    {isLoadingCourses ? (
                      <div className="py-8 text-center">
                        <p>Loading courses...</p>
                      </div>
                    ) : courses.length === 0 ? (
                      <div className="py-8 text-center">
                        <p>No courses found</p>
                      </div>
                    ) : (
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
                          {courses.map((course) => (
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
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="text-destructive"
                                    onClick={() => deleteCourse(course.id)}
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
          {activeTab === "notifications" && <Notifications />}
          {activeTab === "reports" && <Reports />}
        </main>
      </div>
    </div>
  );
}

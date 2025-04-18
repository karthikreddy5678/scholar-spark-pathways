import { useState, useEffect } from "react";
import { Notebook, GraduationCap, Award, TrendingUp, Bell } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { AchievementCard } from "@/components/dashboard/AchievementCard";
import { CourseRecommendationCard } from "@/components/dashboard/CourseRecommendationCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const achievements = [
  {
    id: "1",
    title: "Top Performer",
    description: "Ranked in the top 5% of your class",
    type: "academic" as const,
    date: "Oct 15, 2024",
    icon: "trophy" as const,
    unlocked: true,
  },
  {
    id: "2",
    title: "Perfect Attendance",
    description: "100% attendance for the semester",
    type: "participation" as const,
    date: "Nov 20, 2024",
    icon: "award" as const,
    unlocked: true,
  },
  {
    id: "3",
    title: "Most Improved",
    description: "Greatest grade improvement in class",
    type: "improvement" as const,
    date: "Dec 5, 2024",
    icon: "trending" as const,
    unlocked: true,
  },
  {
    id: "4",
    title: "Excellence in Mathematics",
    description: "Achieved highest score in Math",
    type: "academic" as const,
    date: "Oct 30, 2024",
    icon: "star" as const,
    unlocked: true,
  },
  {
    id: "5",
    title: "Coding Champion",
    description: "Completed all programming challenges",
    type: "special" as const,
    date: "Nov 15, 2024",
    icon: "zap" as const,
    unlocked: true,
  },
  {
    id: "6",
    title: "Bookworm",
    description: "Read all required course materials",
    type: "participation" as const,
    date: "",
    icon: "book" as const,
    unlocked: false,
  },
];

const courseRecommendations = [
  {
    id: "1",
    title: "Advanced Data Structures",
    description: "Enhance your algorithm skills and efficiency",
    relevanceScore: 92,
    skillsImproved: ["Algorithms", "Problem Solving", "Coding"],
  },
  {
    id: "2",
    title: "Statistical Methods in Research",
    description: "Learn practical data analysis techniques",
    relevanceScore: 85,
    skillsImproved: ["Statistics", "Research", "Analysis"],
  },
  {
    id: "3",
    title: "Public Speaking & Communication",
    description: "Develop presentation and communication skills",
    relevanceScore: 78,
    skillsImproved: ["Communication", "Confidence", "Presentation"],
  },
];

const upcomingEvents = [
  {
    id: "1",
    title: "Midterm Exams",
    date: "Nov 15, 2024",
    type: "exam",
  },
  {
    id: "2",
    title: "Programming Project Due",
    date: "Nov 25, 2024",
    type: "assignment",
  },
  {
    id: "3",
    title: "Career Fair",
    date: "Dec 5, 2024",
    type: "event",
  },
];

const notifications = [
  {
    id: "1",
    title: "New Grade Posted",
    message: "Your grade for CS301 has been posted",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    title: "Assignment Reminder",
    message: "Project submission due in 3 days",
    time: "Yesterday",
    read: true,
  },
  {
    id: "3",
    title: "New Badge Earned",
    message: "Congratulations! You earned 'Most Improved'",
    time: "2 days ago",
    read: false,
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [dashboardStats, setDashboardStats] = useState({
    gpa: 0,
    gpaChange: 0,
    coursesCount: 0,
    creditHours: 0,
    badgesCount: 0,
    totalBadges: 12,
    badgesThisTerm: 0,
    notificationsCount: 0,
    unreadNotifications: 0
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!user) return;

      try {
        // Fetch grades for GPA calculation
        const { data: gradesData } = await supabase
          .from('grades')
          .select('grade')
          .eq('student_id', user.id)
          .not('locked', 'is', null);

        // Calculate GPA
        if (gradesData && gradesData.length > 0) {
          const gpa = gradesData.reduce((acc, curr) => acc + Number(curr.grade), 0) / gradesData.length;
          setDashboardStats(prev => ({ ...prev, gpa: Number(gpa.toFixed(2)) }));
        }

        // Fetch enrolled courses
        const { data: coursesData } = await supabase
          .from('courses')
          .select('*');

        if (coursesData) {
          const totalCredits = coursesData.reduce((acc, curr) => acc + curr.credits, 0);
          setDashboardStats(prev => ({
            ...prev,
            coursesCount: coursesData.length,
            creditHours: totalCredits
          }));
        }

        // Fetch notifications count
        const { data: notificationsData } = await supabase
          .from('notifications')
          .select('*')
          .eq('status', 'active')
          .gte('start_date', new Date().toISOString())
          .lte('end_date', new Date().toISOString())
          .or(`audience.eq.all,audience.eq.${user.user_metadata?.role || 'student'}`);

        if (notificationsData) {
          setDashboardStats(prev => ({
            ...prev,
            notificationsCount: notificationsData.length,
            unreadNotifications: notificationsData.filter(n => !n.read_at).length
          }));
        }

      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchDashboardStats();

    // Set up real-time subscription for notifications
    const notificationsChannel = supabase
      .channel('dashboard_notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications'
        },
        () => {
          fetchDashboardStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(notificationsChannel);
    };
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="student" userName="Alex Johnson" />
      
      <main className="container py-6">
        <h1 className="mb-6 font-display text-3xl font-bold">Student Dashboard</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard 
            title="Current GPA" 
            description="Semester average" 
            icon={<GraduationCap className="h-5 w-5" />}
          >
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-edu-purple">{dashboardStats.gpa}</p>
                <p className="text-xs text-muted-foreground">out of 4.0</p>
              </div>
              <div className="flex items-center text-green-500">
                <TrendingUp className="mr-1 h-4 w-4" />
                <span className="text-sm">+{dashboardStats.gpaChange}</span>
              </div>
            </div>
          </DashboardCard>
          
          <DashboardCard 
            title="Courses" 
            description="Currently enrolled" 
            icon={<Notebook className="h-5 w-5" />}
          >
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-edu-purple">{dashboardStats.coursesCount}</p>
                <p className="text-xs text-muted-foreground">{dashboardStats.creditHours} credit hours</p>
              </div>
              <div className="flex items-center">
                <span className="rounded-full bg-edu-purple/10 px-2 py-1 text-xs font-medium text-edu-purple">
                  Fall 2024
                </span>
              </div>
            </div>
          </DashboardCard>
          
          <DashboardCard 
            title="Badges Earned" 
            description="Academic achievements" 
            icon={<Award className="h-5 w-5" />}
          >
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-edu-purple">{dashboardStats.badgesCount}</p>
                <p className="text-xs text-muted-foreground">
                  of {dashboardStats.totalBadges} possible
                </p>
              </div>
              <div className="flex items-center text-green-500">
                <TrendingUp className="mr-1 h-4 w-4" />
                <span className="text-sm">+{dashboardStats.badgesThisTerm} this term</span>
              </div>
            </div>
          </DashboardCard>
          
          <DashboardCard 
            title="Notifications" 
            description="Updates & alerts" 
            icon={<Bell className="h-5 w-5" />}
          >
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-edu-purple">{dashboardStats.notificationsCount}</p>
                <p className="text-xs text-muted-foreground">
                  {dashboardStats.unreadNotifications} unread messages
                </p>
              </div>
              <div>
                {dashboardStats.unreadNotifications > 0 && (
                  <span className="rounded-full bg-red-500/10 px-2 py-1 text-xs font-medium text-red-500">
                    New
                  </span>
                )}
              </div>
            </div>
          </DashboardCard>
        </div>
        
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <DashboardCard 
              title="Academic Performance" 
              description="Track your progress over time"
              className="h-full"
            >
              <div className="h-80">
                <PerformanceChart />
              </div>
            </DashboardCard>
          </div>
          
          <div className="space-y-6">
            <DashboardCard 
              title="Upcoming Events" 
              description="Important dates to remember"
            >
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-start space-x-3">
                    <div className={`mt-0.5 rounded-full p-1 ${
                      event.type === 'exam' ? 'bg-red-100 text-red-600' : 
                      event.type === 'assignment' ? 'bg-blue-100 text-blue-600' : 
                      'bg-green-100 text-green-600'
                    }`}>
                      {event.type === 'exam' ? 
                        <GraduationCap className="h-4 w-4" /> : 
                        event.type === 'assignment' ? 
                          <Notebook className="h-4 w-4" /> : 
                          <Bell className="h-4 w-4" />
                      }
                    </div>
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{event.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>
            
            <DashboardCard 
              title="Recent Notifications" 
              description="Updates from your courses"
            >
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start space-x-3">
                    <div className={`relative mt-0.5 rounded-full p-1 ${
                      notification.read ? 'bg-muted' : 'bg-edu-purple/10 text-edu-purple'
                    }`}>
                      <Bell className="h-4 w-4" />
                      {!notification.read && (
                        <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-edu-purple"></span>
                      )}
                    </div>
                    <div>
                      <p className={`font-medium ${!notification.read ? 'text-edu-purple' : ''}`}>
                        {notification.title}
                      </p>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>
          </div>
        </div>
        
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <AchievementCard achievements={achievements} />
          
          <CourseRecommendationCard recommendations={courseRecommendations} className="h-full" />
        </div>
      </main>
    </div>
  );
}

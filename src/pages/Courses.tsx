
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  CalendarClock, 
  Clock, 
  LucideIcon, 
  Search, 
  GraduationCap,
  Users,
  BookCheck,
  BookOpenCheck,
  Award
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Mock data
interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  instructor: string;
  department: string;
  credits: number;
  schedule: string;
  location: string;
  enrollment: number;
  maxEnrollment: number;
  startDate: string;
  endDate: string;
  status: "enrolled" | "recommended" | "completed" | "available";
  prerequisites: string[];
  thumbnail?: string;
  progress?: number;
  rating?: number;
}

const coursesData: Course[] = [
  {
    id: "1",
    code: "CS301",
    name: "Data Structures and Algorithms",
    description: "A comprehensive study of data structures and the design of efficient algorithms. Topics include arrays, linked lists, stacks, queues, trees, graphs, sorting, searching, and analysis of algorithms.",
    instructor: "Dr. Sarah Miller",
    department: "Computer Science",
    credits: 4,
    schedule: "Mon, Wed, Fri 10:00 AM - 11:15 AM",
    location: "Tech Building 305",
    enrollment: 45,
    maxEnrollment: 50,
    startDate: "Sep 1, 2024",
    endDate: "Dec 15, 2024",
    status: "enrolled",
    prerequisites: ["CS201", "MATH142"],
    progress: 65,
    rating: 4.8
  },
  {
    id: "2",
    code: "CS302",
    name: "Database Systems",
    description: "Introduction to database concepts, data models, SQL, database design principles, normalization, transaction processing, and database implementation.",
    instructor: "Prof. Robert Chen",
    department: "Computer Science",
    credits: 3,
    schedule: "Tue, Thu 1:00 PM - 2:30 PM",
    location: "Tech Building 201",
    enrollment: 38,
    maxEnrollment: 40,
    startDate: "Sep 1, 2024",
    endDate: "Dec 15, 2024",
    status: "enrolled",
    prerequisites: ["CS201"],
    progress: 55,
    rating: 4.5
  },
  {
    id: "3",
    code: "CS303",
    name: "Web Development",
    description: "Learn modern web development technologies including HTML, CSS, JavaScript, React, and Node.js. Build responsive, interactive web applications and understand client-server architecture.",
    instructor: "Dr. James Wilson",
    department: "Computer Science",
    credits: 3,
    schedule: "Mon, Wed 2:00 PM - 3:30 PM",
    location: "Tech Building 105",
    enrollment: 42,
    maxEnrollment: 45,
    startDate: "Sep 1, 2024",
    endDate: "Dec 15, 2024",
    status: "enrolled",
    prerequisites: ["CS101"],
    progress: 60,
    rating: 4.2
  },
  {
    id: "4",
    code: "MATH201",
    name: "Advanced Calculus",
    description: "A rigorous treatment of the calculus of functions of a single variable. Topics include limits, continuity, differentiation, integration, and infinite series.",
    instructor: "Prof. Emily Johnson",
    department: "Mathematics",
    credits: 4,
    schedule: "Mon, Wed, Fri 1:00 PM - 2:15 PM",
    location: "Science Hall 203",
    enrollment: 35,
    maxEnrollment: 40,
    startDate: "Sep 1, 2024",
    endDate: "Dec 15, 2024",
    status: "enrolled",
    prerequisites: ["MATH142", "MATH160"],
    progress: 70,
    rating: 4.6
  },
  {
    id: "5",
    code: "ENGL101",
    name: "Technical Writing",
    description: "Develop skills in technical writing for scientific and professional audiences. Learn document design, clarity, conciseness, and appropriate style for technical communication.",
    instructor: "Prof. Lisa Park",
    department: "English",
    credits: 2,
    schedule: "Tue, Thu 10:00 AM - 11:00 AM",
    location: "Liberal Arts 102",
    enrollment: 30,
    maxEnrollment: 35,
    startDate: "Sep 1, 2024",
    endDate: "Dec 15, 2024",
    status: "enrolled",
    prerequisites: [],
    progress: 50,
    rating: 4.0
  },
  {
    id: "6",
    code: "CS401",
    name: "Artificial Intelligence",
    description: "Introduction to artificial intelligence concepts, problem-solving methods, knowledge representation, machine learning, natural language processing, and neural networks.",
    instructor: "Dr. Michael Brown",
    department: "Computer Science",
    credits: 3,
    schedule: "Mon, Wed, Fri 3:00 PM - 4:15 PM",
    location: "Tech Building 310",
    enrollment: 32,
    maxEnrollment: 35,
    startDate: "Jan 15, 2025",
    endDate: "May 10, 2025",
    status: "recommended",
    prerequisites: ["CS301", "MATH201"]
  },
  {
    id: "7",
    code: "CS405",
    name: "Machine Learning",
    description: "Study of algorithms and statistical models that enable computer systems to improve performance based on data, without explicit programming.",
    instructor: "Dr. Alexandra Lee",
    department: "Computer Science",
    credits: 3,
    schedule: "Tue, Thu 3:00 PM - 4:30 PM",
    location: "Tech Building 205",
    enrollment: 25,
    maxEnrollment: 30,
    startDate: "Jan 15, 2025",
    endDate: "May 10, 2025",
    status: "recommended",
    prerequisites: ["CS301", "MATH201", "MATH215"]
  },
  {
    id: "8",
    code: "CS201",
    name: "Introduction to Programming",
    description: "Fundamental programming concepts, algorithmic thinking, problem-solving strategies, and coding skills using a high-level programming language.",
    instructor: "Prof. David Thompson",
    department: "Computer Science",
    credits: 3,
    schedule: "Mon, Wed, Fri 9:00 AM - 10:15 AM",
    location: "Tech Building 101",
    enrollment: 48,
    maxEnrollment: 50,
    startDate: "Jan 15, 2024",
    endDate: "May 10, 2024",
    status: "completed",
    prerequisites: [],
    rating: 4.9
  },
  {
    id: "9",
    code: "MATH142",
    name: "Calculus I",
    description: "Introduction to differential and integral calculus, including limits, derivatives, applications of differentiation, and basic integration techniques.",
    instructor: "Dr. Rebecca White",
    department: "Mathematics",
    credits: 4,
    schedule: "Mon, Wed, Fri 10:00 AM - 11:15 AM",
    location: "Science Hall 101",
    enrollment: 50,
    maxEnrollment: 50,
    startDate: "Jan 15, 2024",
    endDate: "May 10, 2024",
    status: "completed",
    prerequisites: ["MATH140"],
    rating: 4.3
  }
];

type CourseStatusCardProps = {
  title: string;
  count: number;
  icon: LucideIcon;
  color: string;
};

function CourseStatusCard({ title, count, icon: Icon, color }: CourseStatusCardProps) {
  return (
    <DashboardCard title={title} className="h-full">
      <div className="flex items-center space-x-4">
        <div className={cn("rounded-full p-3", color)}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-3xl font-bold text-edu-purple">{count}</p>
        </div>
      </div>
    </DashboardCard>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <Card className={cn(
      "overflow-hidden transition-all hover:shadow-md",
      course.status === "enrolled" && "border-l-4 border-l-edu-purple",
      course.status === "recommended" && "border-l-4 border-l-edu-blue",
      course.status === "completed" && "border-l-4 border-l-edu-green",
    )}>
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">{course.name}</CardTitle>
            <CardDescription className="text-sm">{course.code} • {course.credits} credits</CardDescription>
          </div>
          <Badge 
            variant="outline" 
            className={cn(
              "capitalize",
              course.status === "enrolled" && "bg-edu-purple/10 text-edu-purple",
              course.status === "recommended" && "bg-edu-blue/10 text-edu-blue",
              course.status === "completed" && "bg-edu-green/10 text-edu-green",
              course.status === "available" && "bg-gray-200 text-gray-700",
            )}
          >
            {course.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {course.description}
        </p>
        
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div className="flex items-center gap-1">
            <GraduationCap className="h-4 w-4 text-edu-purple" />
            <span className="text-muted-foreground">Instructor:</span>
          </div>
          <div className="font-medium">{course.instructor}</div>
          
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-edu-purple" />
            <span className="text-muted-foreground">Enrollment:</span>
          </div>
          <div className="font-medium">{course.enrollment}/{course.maxEnrollment}</div>
          
          <div className="flex items-center gap-1">
            <CalendarClock className="h-4 w-4 text-edu-purple" />
            <span className="text-muted-foreground">Schedule:</span>
          </div>
          <div className="font-medium">{course.schedule}</div>
        </div>
        
        {course.progress !== undefined && (
          <div className="mt-4 space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Course Progress</span>
              <span className="font-medium">{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2" />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t bg-muted/30 p-3">
        {course.status === "enrolled" && (
          <Button variant="outline" size="sm" className="gap-1">
            <BookOpen className="h-4 w-4" />
            <span>Go to Course</span>
          </Button>
        )}
        {course.status === "recommended" && (
          <Button variant="outline" size="sm" className="gap-1">
            <BookOpenCheck className="h-4 w-4" />
            <span>View Details</span>
          </Button>
        )}
        {course.status === "completed" && (
          <Button variant="outline" size="sm" className="gap-1">
            <Award className="h-4 w-4" />
            <span>View Certificate</span>
          </Button>
        )}
        {course.status === "available" && (
          <Button variant="outline" size="sm" className="gap-1">
            <BookCheck className="h-4 w-4" />
            <span>Enroll</span>
          </Button>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{course.startDate} - {course.endDate}</span>
        </div>
      </CardFooter>
    </Card>
  );
}

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const enrolledCourses = coursesData.filter(course => course.status === "enrolled");
  const recommendedCourses = coursesData.filter(course => course.status === "recommended");
  const completedCourses = coursesData.filter(course => course.status === "completed");
  
  const filterCourses = (courses: Course[]) => {
    if (!searchTerm) return courses;
    
    return courses.filter(course => 
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="student" userName="Alex Johnson" />
      
      <main className="container pb-10 pt-6">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-display text-3xl font-bold">My Courses</h1>
            <p className="text-muted-foreground">
              Manage your enrolled courses and explore recommendations
            </p>
          </div>
          
          <div className="w-full max-w-sm">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search courses..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <CourseStatusCard 
            title="Enrolled" 
            count={enrolledCourses.length} 
            icon={BookOpen}
            color="bg-edu-purple"
          />
          <CourseStatusCard 
            title="Recommended" 
            count={recommendedCourses.length} 
            icon={BookOpenCheck}
            color="bg-edu-blue"
          />
          <CourseStatusCard 
            title="Completed" 
            count={completedCourses.length} 
            icon={Award}
            color="bg-edu-green"
          />
          <CourseStatusCard 
            title="Total Credits" 
            count={enrolledCourses.reduce((acc, course) => acc + course.credits, 0)} 
            icon={GraduationCap}
            color="bg-edu-yellow"
          />
        </div>
        
        <Tabs defaultValue="enrolled" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-3 md:w-[400px]">
            <TabsTrigger value="enrolled">Enrolled</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="enrolled" className="mt-0">
            {filterCourses(enrolledCourses).length === 0 ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <BookOpen className="mb-2 h-10 w-10 text-muted-foreground" />
                <h3 className="mb-1 text-lg font-medium">No enrolled courses found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchTerm ? "Try a different search term or clear your search." : "You are not enrolled in any courses yet."}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filterCourses(enrolledCourses).map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="recommended" className="mt-0">
            {filterCourses(recommendedCourses).length === 0 ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <BookOpenCheck className="mb-2 h-10 w-10 text-muted-foreground" />
                <h3 className="mb-1 text-lg font-medium">No recommended courses found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchTerm ? "Try a different search term or clear your search." : "There are no course recommendations for you at this time."}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filterCourses(recommendedCourses).map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="mt-0">
            {filterCourses(completedCourses).length === 0 ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <Award className="mb-2 h-10 w-10 text-muted-foreground" />
                <h3 className="mb-1 text-lg font-medium">No completed courses found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchTerm ? "Try a different search term or clear your search." : "You haven't completed any courses yet."}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filterCourses(completedCourses).map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

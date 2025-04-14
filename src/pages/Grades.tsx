
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CalendarIcon, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  BookOpen,
  BarChart4 
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

// Mock data
interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  instructor: string;
  grade: string;
  percentage: number;
  lastUpdated: string;
  status: "completed" | "ongoing" | "upcoming";
  trend: "up" | "down" | "stable";
  assessments: Assessment[];
  skills: Skill[];
}

interface Assessment {
  id: string;
  name: string;
  type: "exam" | "assignment" | "quiz" | "project";
  weight: number;
  score: number;
  maxScore: number;
  dueDate: string;
  submitted: boolean;
  feedback?: string;
}

interface Skill {
  name: string;
  proficiency: number;
}

const coursesData: Course[] = [
  {
    id: "1",
    code: "CS301",
    name: "Data Structures and Algorithms",
    credits: 4,
    instructor: "Dr. Sarah Miller",
    grade: "A",
    percentage: 92,
    lastUpdated: "Oct 15, 2024",
    status: "ongoing",
    trend: "up",
    assessments: [
      {
        id: "a1",
        name: "Midterm Exam",
        type: "exam",
        weight: 30,
        score: 89,
        maxScore: 100,
        dueDate: "Oct 10, 2024",
        submitted: true,
        feedback: "Excellent understanding of algorithms. Work on time complexity analysis."
      },
      {
        id: "a2",
        name: "Sorting Algorithms Assignment",
        type: "assignment",
        weight: 15,
        score: 95,
        maxScore: 100,
        dueDate: "Sep 25, 2024",
        submitted: true,
        feedback: "Great implementation and documentation."
      },
      {
        id: "a3",
        name: "Quiz 1",
        type: "quiz",
        weight: 10,
        score: 90,
        maxScore: 100,
        dueDate: "Sep 15, 2024",
        submitted: true
      },
      {
        id: "a4",
        name: "Final Project",
        type: "project",
        weight: 30,
        score: 0,
        maxScore: 100,
        dueDate: "Dec 5, 2024",
        submitted: false
      },
      {
        id: "a5",
        name: "Final Exam",
        type: "exam",
        weight: 35,
        score: 0,
        maxScore: 100,
        dueDate: "Dec 15, 2024",
        submitted: false
      }
    ],
    skills: [
      { name: "Algorithm Design", proficiency: 85 },
      { name: "Data Structures", proficiency: 90 },
      { name: "Time Complexity", proficiency: 75 },
      { name: "Problem Solving", proficiency: 88 }
    ]
  },
  {
    id: "2",
    code: "CS302",
    name: "Database Systems",
    credits: 3,
    instructor: "Prof. Robert Chen",
    grade: "A-",
    percentage: 88,
    lastUpdated: "Oct 12, 2024",
    status: "ongoing",
    trend: "stable",
    assessments: [
      {
        id: "b1",
        name: "SQL Assignment",
        type: "assignment",
        weight: 20,
        score: 88,
        maxScore: 100,
        dueDate: "Oct 1, 2024",
        submitted: true
      },
      {
        id: "b2",
        name: "Database Design Project",
        type: "project",
        weight: 25,
        score: 90,
        maxScore: 100,
        dueDate: "Nov 10, 2024",
        submitted: true
      },
      {
        id: "b3",
        name: "Midterm Exam",
        type: "exam",
        weight: 30,
        score: 85,
        maxScore: 100,
        dueDate: "Oct 20, 2024",
        submitted: true
      }
    ],
    skills: [
      { name: "SQL", proficiency: 88 },
      { name: "Database Design", proficiency: 85 },
      { name: "Normalization", proficiency: 80 },
      { name: "Query Optimization", proficiency: 75 }
    ]
  },
  {
    id: "3",
    code: "CS303",
    name: "Web Development",
    credits: 3,
    instructor: "Dr. James Wilson",
    grade: "B+",
    percentage: 85,
    lastUpdated: "Oct 18, 2024",
    status: "ongoing",
    trend: "down",
    assessments: [
      {
        id: "c1",
        name: "Frontend Project",
        type: "project",
        weight: 25,
        score: 82,
        maxScore: 100,
        dueDate: "Oct 5, 2024",
        submitted: true
      },
      {
        id: "c2",
        name: "Backend Assignment",
        type: "assignment",
        weight: 20,
        score: 78,
        maxScore: 100,
        dueDate: "Sep 25, 2024",
        submitted: true
      },
      {
        id: "c3",
        name: "Quiz 2",
        type: "quiz",
        weight: 10,
        score: 90,
        maxScore: 100,
        dueDate: "Oct 15, 2024",
        submitted: true
      }
    ],
    skills: [
      { name: "HTML/CSS", proficiency: 90 },
      { name: "JavaScript", proficiency: 85 },
      { name: "React", proficiency: 80 },
      { name: "Node.js", proficiency: 75 }
    ]
  },
  {
    id: "4",
    code: "MATH201",
    name: "Advanced Calculus",
    credits: 4,
    instructor: "Prof. Emily Johnson",
    grade: "A",
    percentage: 93,
    lastUpdated: "Oct 5, 2024",
    status: "ongoing",
    trend: "up",
    assessments: [
      {
        id: "d1",
        name: "Problem Set 1",
        type: "assignment",
        weight: 15,
        score: 95,
        maxScore: 100,
        dueDate: "Sep 20, 2024",
        submitted: true
      },
      {
        id: "d2",
        name: "Midterm Exam",
        type: "exam",
        weight: 35,
        score: 92,
        maxScore: 100,
        dueDate: "Oct 10, 2024",
        submitted: true
      },
      {
        id: "d3",
        name: "Problem Set 2",
        type: "assignment",
        weight: 15,
        score: 91,
        maxScore: 100,
        dueDate: "Nov 5, 2024",
        submitted: true
      }
    ],
    skills: [
      { name: "Differentiation", proficiency: 95 },
      { name: "Integration", proficiency: 90 },
      { name: "Series", proficiency: 85 },
      { name: "Mathematical Reasoning", proficiency: 90 }
    ]
  },
  {
    id: "5",
    code: "ENGL101",
    name: "Technical Writing",
    credits: 2,
    instructor: "Prof. Lisa Park",
    grade: "A-",
    percentage: 89,
    lastUpdated: "Oct 12, 2024",
    status: "ongoing",
    trend: "stable",
    assessments: [
      {
        id: "e1",
        name: "Essay 1",
        type: "assignment",
        weight: 25,
        score: 88,
        maxScore: 100,
        dueDate: "Sep 30, 2024",
        submitted: true
      },
      {
        id: "e2",
        name: "Presentation",
        type: "project",
        weight: 20,
        score: 90,
        maxScore: 100,
        dueDate: "Oct 15, 2024",
        submitted: true
      },
      {
        id: "e3",
        name: "Essay 2",
        type: "assignment",
        weight: 25,
        score: 0,
        maxScore: 100,
        dueDate: "Nov 20, 2024",
        submitted: false
      }
    ],
    skills: [
      { name: "Written Communication", proficiency: 88 },
      { name: "Technical Documentation", proficiency: 90 },
      { name: "Presentation Skills", proficiency: 85 },
      { name: "Research", proficiency: 80 }
    ]
  }
];

// Grade distribution data for pie chart
const gradeDistributionData = [
  { name: "A", value: 2, color: "#8B5CF6" },
  { name: "A-", value: 2, color: "#A78BFA" },
  { name: "B+", value: 1, color: "#C4B5FD" },
  { name: "B", value: 0, color: "#DDD6FE" },
  { name: "B-", value: 0, color: "#EDE9FE" },
  { name: "C+", value: 0, color: "#F5F3FF" },
];

// Credit hour data
const creditData = [
  { name: "Completed", value: 48, color: "#10B981" },
  { name: "In Progress", value: 16, color: "#8B5CF6" },
  { name: "Remaining", value: 60, color: "#E5E7EB" },
];

export default function Grades() {
  const [semester, setSemester] = useState("current");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  // Calculate GPA
  const totalCredits = coursesData.reduce((acc, course) => acc + course.credits, 0);
  const gradePoints = coursesData.reduce((acc, course) => {
    let points = 0;
    switch(course.grade) {
      case "A": points = 4.0; break;
      case "A-": points = 3.7; break;
      case "B+": points = 3.3; break;
      case "B": points = 3.0; break;
      case "B-": points = 2.7; break;
      case "C+": points = 2.3; break;
      case "C": points = 2.0; break;
      default: points = 0;
    }
    return acc + (points * course.credits);
  }, 0);
  
  const gpa = gradePoints / totalCredits;

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="student" userName="Alex Johnson" />
      
      <main className="container pb-10 pt-6">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-display text-3xl font-bold">Academic Records</h1>
            <p className="text-muted-foreground">
              Track your grades, assessments, and academic progress
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Semester:</span>
            <Select value={semester} onValueChange={setSemester}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Fall 2024 (Current)</SelectItem>
                <SelectItem value="spring2024">Spring 2024</SelectItem>
                <SelectItem value="fall2023">Fall 2023</SelectItem>
                <SelectItem value="spring2023">Spring 2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="mb-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Current GPA"
            description="Fall 2024"
            icon={<BarChart4 className="h-5 w-5" />}
          >
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-edu-purple">{gpa.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">out of 4.00</p>
              </div>
              <div className="flex items-center text-green-500">
                <TrendingUp className="mr-1 h-4 w-4" />
                <span className="text-sm">+0.2</span>
              </div>
            </div>
          </DashboardCard>
          
          <DashboardCard
            title="Credit Hours"
            description="Progress toward degree"
            icon={<BookOpen className="h-5 w-5" />}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Completed:</span>
                <span className="font-medium text-green-500">48</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">In Progress:</span>
                <span className="font-medium text-edu-purple">16</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Required:</span>
                <span className="font-medium">124</span>
              </div>
              <Progress value={51.6} className="mt-1 h-2" />
              <p className="text-xs text-right text-muted-foreground">51.6% Complete</p>
            </div>
          </DashboardCard>
          
          <Card className="col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Grade Distribution</CardTitle>
              <CardDescription>Current semester breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid h-[120px] grid-cols-2 gap-4">
                <div className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={gradeDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={50}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name }) => name}
                      >
                        {gradeDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={creditData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={50}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {creditData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Current Courses</CardTitle>
                <CardDescription>Fall 2024 Semester</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Instructor</TableHead>
                      <TableHead className="hidden md:table-cell">Credits</TableHead>
                      <TableHead className="text-right">Grade</TableHead>
                      <TableHead className="text-right">Trend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coursesData.map((course) => (
                      <TableRow 
                        key={course.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedCourse(course)}
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium">{course.code}</p>
                            <p className="text-sm text-muted-foreground">{course.name}</p>
                          </div>
                        </TableCell>
                        <TableCell>{course.instructor}</TableCell>
                        <TableCell className="hidden md:table-cell">{course.credits}</TableCell>
                        <TableCell className="text-right">
                          <Badge 
                            variant="outline" 
                            className="font-semibold text-edu-purple"
                          >
                            {course.grade} ({course.percentage}%)
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {course.trend === "up" && (
                            <TrendingUp className="ml-auto h-5 w-5 text-green-500" />
                          )}
                          {course.trend === "down" && (
                            <TrendingDown className="ml-auto h-5 w-5 text-red-500" />
                          )}
                          {course.trend === "stable" && (
                            <Minus className="ml-auto h-5 w-5 text-muted-foreground" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          
          <div>
            {selectedCourse ? (
              <Card>
                <CardHeader>
                  <CardTitle>
                    <div className="flex items-center justify-between">
                      <span>{selectedCourse.code}</span>
                      <Badge 
                        variant="outline" 
                        className="font-semibold text-edu-purple"
                      >
                        {selectedCourse.grade}
                      </Badge>
                    </div>
                  </CardTitle>
                  <CardDescription>{selectedCourse.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="assessments">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="assessments">Assessments</TabsTrigger>
                      <TabsTrigger value="skills">Skills</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="assessments" className="space-y-4 pt-4">
                      <Accordion type="single" collapsible className="w-full">
                        {selectedCourse.assessments.map((assessment) => (
                          <AccordionItem key={assessment.id} value={assessment.id}>
                            <AccordionTrigger>
                              <div className="flex w-full items-center justify-between pr-4 text-left">
                                <span>{assessment.name}</span>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="outline"
                                    className={
                                      assessment.submitted
                                        ? "bg-green-100 text-green-700"
                                        : "bg-amber-100 text-amber-700"
                                    }
                                  >
                                    {assessment.submitted ? "Completed" : "Pending"}
                                  </Badge>
                                  {assessment.submitted && (
                                    <span className="font-semibold">
                                      {assessment.score}/{assessment.maxScore}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-2 px-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Type:</span>
                                <span className="text-sm font-medium capitalize">
                                  {assessment.type}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Weight:</span>
                                <span className="text-sm font-medium">{assessment.weight}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Due Date:</span>
                                <span className="text-sm font-medium flex items-center">
                                  <CalendarIcon className="mr-1 h-3 w-3" />
                                  {assessment.dueDate}
                                </span>
                              </div>
                              {assessment.feedback && (
                                <div className="mt-2 rounded-lg bg-muted p-3">
                                  <p className="text-sm font-medium">Feedback:</p>
                                  <p className="text-sm text-muted-foreground">
                                    {assessment.feedback}
                                  </p>
                                </div>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </TabsContent>
                    
                    <TabsContent value="skills" className="pt-4">
                      <div className="space-y-4">
                        {selectedCourse.skills.map((skill) => (
                          <div key={skill.name} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{skill.name}</span>
                              <span className="text-sm">{skill.proficiency}%</span>
                            </div>
                            <Progress value={skill.proficiency} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card className="flex h-full items-center justify-center p-6">
                <div className="text-center">
                  <BookOpen className="mx-auto h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Course Details</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Select a course to view detailed information about assessments and performance.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

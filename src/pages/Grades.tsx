
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { BookOpen, BarChart2, Award } from "lucide-react";

interface CourseGrade {
  id: number;
  course_title: string;
  course_code: string;
  credits: number;
  grade: number;
  status: "completed" | "in_progress" | "upcoming";
}

export default function Grades() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [grades, setGrades] = useState<CourseGrade[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchGrades();
  }, [user, navigate]);

  const fetchGrades = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from("grades")
        .select(`
          id,
          grade,
          course:course_id(
            id,
            title,
            course_id,
            credits
          )
        `)
        .eq("student_id", user?.id)
        .order("id", { ascending: false });

      if (error) throw error;

      // Transform the data to match the CourseGrade interface
      const formattedGrades: CourseGrade[] = data.map((item) => ({
        id: item.id,
        course_title: item.course?.title || "Unknown Course",
        course_code: item.course?.course_id || "N/A",
        credits: item.course?.credits || 0,
        grade: item.grade || 0,
        status: "completed",
      }));

      setGrades(formattedGrades);
    } catch (error) {
      console.error("Error fetching grades:", error);
      toast({
        title: "Error",
        description: "Failed to load grades data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Convert a 4.0 scale grade to a 10.0 scale
  const convertTo10Scale = (grade: number) => {
    // Simple conversion: multiply by 10/4
    return (grade * 2.5).toFixed(2);
  };

  // Calculate GPA on a 10.0 scale
  const calculateGPA = () => {
    if (grades.length === 0) return "0.00";
    
    const totalCredits = grades.reduce((sum, course) => sum + course.credits, 0);
    const weightedGradeSum = grades.reduce(
      (sum, course) => sum + (course.grade * 2.5 * course.credits), 0
    );
    
    return (weightedGradeSum / totalCredits).toFixed(2);
  };

  // Create grade letter from numeric grade (on 10.0 scale)
  const getGradeLetter = (grade: number) => {
    const scaledGrade = grade * 2.5; // Convert to 10-point scale
    
    if (scaledGrade >= 9.0) return "A+";
    if (scaledGrade >= 8.0) return "A";
    if (scaledGrade >= 7.0) return "B+";
    if (scaledGrade >= 6.0) return "B";
    if (scaledGrade >= 5.0) return "C+";
    if (scaledGrade >= 4.0) return "C";
    if (scaledGrade >= 3.5) return "D+";
    if (scaledGrade >= 3.0) return "D";
    return "F";
  };

  // Get text color based on grade
  const getGradeColor = (grade: number) => {
    const scaledGrade = grade * 2.5; // Convert to 10-point scale
    
    if (scaledGrade >= 8.0) return "text-green-500";
    if (scaledGrade >= 6.0) return "text-blue-500";
    if (scaledGrade >= 4.0) return "text-amber-500";
    return "text-red-500";
  };

  // Determine class distinction based on CGPA
  const getDistinction = () => {
    const gpa = parseFloat(calculateGPA());
    
    if (gpa >= 9.0) return "Distinction with Honors";
    if (gpa >= 8.0) return "Distinction";
    if (gpa >= 7.0) return "First Class";
    if (gpa >= 6.0) return "Second Class";
    if (gpa >= 5.0) return "Pass";
    return "Fail";
  };

  // Calculate total credits
  const getTotalCredits = () => {
    return grades.reduce((sum, course) => sum + course.credits, 0);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Grade Report</h1>
        <p className="text-muted-foreground">View and track your academic performance</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <DashboardCard
          title="CGPA"
          description="Cumulative Grade Point Average"
          icon={<BarChart2 className="text-primary" />}
        >
          <div>
            <p className="text-3xl font-bold">{calculateGPA()}/10.00</p>
            <p className="text-sm text-muted-foreground">{getDistinction()}</p>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Credits Completed"
          description="Total course credits"
          icon={<BookOpen className="text-primary" />}
        >
          <p className="text-3xl font-bold">{getTotalCredits()}</p>
          <p className="text-sm text-muted-foreground">
            {grades.length} courses
          </p>
        </DashboardCard>

        <DashboardCard
          title="Academic Standing"
          description="Current status"
          icon={<Award className="text-primary" />}
        >
          <p className="text-3xl font-bold">{getDistinction()}</p>
          <p className="text-sm text-muted-foreground">
            {parseFloat(calculateGPA()) >= 5.0 ? "Good standing" : "Needs improvement"}
          </p>
        </DashboardCard>
      </div>

      <DashboardCard title="Course Grades">
        {isLoading ? (
          <div className="py-8 text-center">
            <p>Loading grade data...</p>
          </div>
        ) : grades.length === 0 ? (
          <div className="py-8 text-center">
            <p>No grade records found.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Code</TableHead>
                <TableHead>Course Title</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Grade (10.0)</TableHead>
                <TableHead>Letter</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grades.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">
                    {course.course_code}
                  </TableCell>
                  <TableCell>{course.course_title}</TableCell>
                  <TableCell>{course.credits}</TableCell>
                  <TableCell className={getGradeColor(course.grade)}>
                    {convertTo10Scale(course.grade)}
                  </TableCell>
                  <TableCell className={getGradeColor(course.grade)}>
                    {getGradeLetter(course.grade)}
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400">
                      {course.status === "completed"
                        ? "Completed"
                        : course.status === "in_progress"
                        ? "In Progress"
                        : "Upcoming"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DashboardCard>

      <div className="mt-8 text-sm text-muted-foreground">
        <p>
          <strong>Note:</strong> Grades are displayed on a 10.0 scale. If you notice any discrepancies, please contact your academic advisor.
        </p>
      </div>
    </div>
  );
}

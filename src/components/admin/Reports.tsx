
import { useState, useEffect } from "react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { FileText, Download, Filter, BarChart2, Users, BookOpen, Layers, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Reports() {
  const [reportType, setReportType] = useState("students");
  const [reportPeriod, setReportPeriod] = useState("semester");
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reportStats, setReportStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalProfessors: 0,
    avgGrade: 0
  });
  
  useEffect(() => {
    fetchReportData();
  }, [reportType, reportPeriod]);
  
  const fetchReportData = async () => {
    setIsLoading(true);
    try {
      // Fetch basic stats first
      await fetchReportStats();
      
      // Then fetch chart data based on report type
      if (reportType === "students") {
        await fetchStudentData();
      } else if (reportType === "courses") {
        await fetchCourseData();
      } else if (reportType === "grades") {
        await fetchGradeData();
      } else if (reportType === "events") {
        await fetchEventData();
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
      toast({
        title: "Error",
        description: "Failed to load report data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchReportStats = async () => {
    try {
      // Get total students
      const { count: studentCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student');
      
      // Get total courses
      const { count: courseCount } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true });
      
      // Get total professors
      const { count: professorCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'professor');
      
      // Get average grade
      const { data: gradesData } = await supabase
        .from('grades')
        .select('grade');
      
      const avgGrade = gradesData && gradesData.length > 0
        ? gradesData.reduce((acc, curr) => {
            // Convert to number explicitly to fix type error
            const gradeValue = typeof curr.grade === 'string' 
              ? parseFloat(curr.grade) 
              : Number(curr.grade);
            return acc + gradeValue;
          }, 0) / gradesData.length
        : 0;
      
      setReportStats({
        totalStudents: studentCount || 0,
        totalCourses: courseCount || 0,
        totalProfessors: professorCount || 0,
        avgGrade: Math.round(avgGrade * 10) / 10
      });
      
    } catch (error) {
      console.error("Error fetching report stats:", error);
    }
  };
  
  const fetchStudentData = async () => {
    // In a real app, we'd fetch data grouped by relevant periods
    // For this example, we'll create some sample data
    const studentData = [
      { name: 'Computer Science', students: 120 },
      { name: 'Engineering', students: 98 },
      { name: 'Mathematics', students: 75 },
      { name: 'Physics', students: 62 },
      { name: 'Chemistry', students: 58 },
      { name: 'Biology', students: 80 },
    ];
    
    setChartData(studentData);
  };
  
  const fetchCourseData = async () => {
    // Sample course data
    const courseData = [
      { name: 'CS Dept', courses: 42 },
      { name: 'Engineering', courses: 38 },
      { name: 'Mathematics', courses: 24 },
      { name: 'Physics', courses: 18 },
      { name: 'Chemistry', courses: 15 },
      { name: 'Biology', courses: 22 },
    ];
    
    setChartData(courseData);
  };
  
  const fetchGradeData = async () => {
    try {
      // In a real app, we would fetch and aggregate grade data
      // For this example, we'll create sample data
      const gradeData = [
        { name: 'A', count: 245 },
        { name: 'B', count: 375 },
        { name: 'C', count: 210 },
        { name: 'D', count: 85 },
        { name: 'F', count: 45 },
      ];
      
      setChartData(gradeData);
    } catch (error) {
      console.error("Error fetching grade data:", error);
      throw error;
    }
  };
  
  const fetchEventData = async () => {
    // Sample event data
    const eventData = [
      { name: 'Exams', count: 18 },
      { name: 'Workshops', count: 24 },
      { name: 'Meetings', count: 32 },
      { name: 'Seminars', count: 14 },
      { name: 'Other', count: 8 },
    ];
    
    setChartData(eventData);
  };
  
  const generateReport = () => {
    toast({
      title: "Report generated",
      description: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report for the ${reportPeriod} has been generated`
    });
  };
  
  const downloadReport = () => {
    toast({
      title: "Report downloaded",
      description: "The report has been downloaded as a CSV file"
    });
  };
  
  // Get proper data key based on report type
  const getDataKey = () => {
    switch(reportType) {
      case "students":
        return "students";
      case "courses":
        return "courses";
      case "grades":
        return "count";
      case "events":
        return "count";
      default:
        return "value";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Report Generation</h2>
          <p className="text-muted-foreground">Generate and analyze data reports</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={generateReport}>
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
          <Button variant="outline" onClick={downloadReport}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Students"
          description="Currently enrolled"
          icon={<Users className="text-blue-500" />}
        >
          <p className="text-3xl font-bold">{reportStats.totalStudents}</p>
        </DashboardCard>
        
        <DashboardCard
          title="Active Courses"
          description="This semester"
          icon={<BookOpen className="text-green-500" />}
        >
          <p className="text-3xl font-bold">{reportStats.totalCourses}</p>
        </DashboardCard>
        
        <DashboardCard
          title="Teaching Staff"
          description="Professors"
          icon={<Users className="text-purple-500" />}
        >
          <p className="text-3xl font-bold">{reportStats.totalProfessors}</p>
        </DashboardCard>
        
        <DashboardCard
          title="Average Grade"
          description="All courses"
          icon={<Layers className="text-orange-500" />}
        >
          <p className="text-3xl font-bold">{reportStats.avgGrade}</p>
        </DashboardCard>
      </div>
      
      <div className="flex gap-4 items-center">
        <div className="flex gap-4 items-center flex-1">
          <div className="flex-1">
            <Select
              value={reportType}
              onValueChange={setReportType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="students">Student Reports</SelectItem>
                <SelectItem value="courses">Course Reports</SelectItem>
                <SelectItem value="grades">Grade Distribution</SelectItem>
                <SelectItem value="events">Event Analysis</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1">
            <Select
              value={reportPeriod}
              onValueChange={setReportPeriod}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Weekly</SelectItem>
                <SelectItem value="month">Monthly</SelectItem>
                <SelectItem value="semester">Semester</SelectItem>
                <SelectItem value="year">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      <DashboardCard 
        title={`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report - ${reportPeriod.charAt(0).toUpperCase() + reportPeriod.slice(1)}`}
        description="Visual representation of the data"
        icon={<BarChart2 />}
      >
        {isLoading ? (
          <div className="py-8 text-center">
            <p>Loading report data...</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <FileText className="h-10 w-10 mx-auto mb-4 opacity-50" />
            <p>No data available for this report</p>
          </div>
        ) : (
          <div className="h-[400px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={getDataKey()} fill="#7c3aed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </DashboardCard>
      
      <div className="grid gap-6 md:grid-cols-2">
        <DashboardCard
          title="Report History"
          description="Previously generated reports"
        >
          <div className="py-8 text-center text-muted-foreground">
            <Calendar className="h-10 w-10 mx-auto mb-4 opacity-50" />
            <p>No report history available</p>
            <Button variant="outline" size="sm" className="mt-4">
              View Archive
            </Button>
          </div>
        </DashboardCard>
        
        <DashboardCard
          title="Scheduled Reports"
          description="Automated report generation"
        >
          <div className="py-8 text-center text-muted-foreground">
            <Calendar className="h-10 w-10 mx-auto mb-4 opacity-50" />
            <p>No scheduled reports</p>
            <Button variant="outline" size="sm" className="mt-4">
              Schedule Report
            </Button>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}



import { useEffect, useState } from "react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  BarChart,
  Bar
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data
const performanceData = [
  { month: "Jan", grades: 78, attendance: 95, participation: 70 },
  { month: "Feb", grades: 82, attendance: 98, participation: 75 },
  { month: "Mar", grades: 80, attendance: 92, participation: 85 },
  { month: "Apr", grades: 85, attendance: 90, participation: 80 },
  { month: "May", grades: 88, attendance: 96, participation: 90 },
  { month: "Jun", grades: 90, attendance: 94, participation: 85 },
];

const subjectData = [
  { subject: "Math", score: 92, average: 78 },
  { subject: "Science", score: 88, average: 76 },
  { subject: "History", score: 75, average: 72 },
  { subject: "English", score: 85, average: 80 },
  { subject: "CS", score: 95, average: 82 },
];

export function PerformanceChart() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="h-80 w-full animate-pulse bg-accent rounded-md"></div>;
  }

  return (
    <Tabs defaultValue="trends">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="trends">Performance Trends</TabsTrigger>
        <TabsTrigger value="subjects">Subject Performance</TabsTrigger>
      </TabsList>
      <TabsContent value="trends" className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={performanceData}
            margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="grades" 
              stroke="#8B5CF6" 
              activeDot={{ r: 8 }} 
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="attendance" 
              stroke="#3B82F6" 
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="participation" 
              stroke="#10B981" 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </TabsContent>
      <TabsContent value="subjects" className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={subjectData}
            margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="subject" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="score" fill="#8B5CF6" name="Your Score" />
            <Bar dataKey="average" fill="#C4B5FD" name="Class Average" />
          </BarChart>
        </ResponsiveContainer>
      </TabsContent>
    </Tabs>
  );
}

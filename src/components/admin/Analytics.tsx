
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { BarChart, LineChart, AreaChart, ResponsiveContainer, XAxis, YAxis, Bar, Line, Area, Tooltip, CartesianGrid } from "recharts";
import { TrendingUp, Users, GraduationCap, BookOpen } from "lucide-react";

const performanceData = [
  { month: "Jan", average: 85, submissions: 120 },
  { month: "Feb", average: 88, submissions: 150 },
  { month: "Mar", average: 82, submissions: 130 },
  { month: "Apr", average: 89, submissions: 145 },
];

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Student Growth"
          description="Year over year"
          icon={<TrendingUp className="text-green-500" />}
        >
          <p className="text-2xl font-bold">+12%</p>
          <p className="text-sm text-muted-foreground">Compared to last year</p>
        </DashboardCard>

        <DashboardCard
          title="Average GPA"
          description="Current semester"
          icon={<Users className="text-blue-500" />}
        >
          <p className="text-2xl font-bold">3.45</p>
          <p className="text-sm text-green-600">+0.2 from last semester</p>
        </DashboardCard>

        <DashboardCard
          title="Graduation Rate"
          description="Last batch"
          icon={<GraduationCap className="text-purple-500" />}
        >
          <p className="text-2xl font-bold">92%</p>
          <p className="text-sm text-muted-foreground">Expected this year</p>
        </DashboardCard>

        <DashboardCard
          title="Course Completion"
          description="Average rate"
          icon={<BookOpen className="text-orange-500" />}
        >
          <p className="text-2xl font-bold">94%</p>
          <p className="text-sm text-muted-foreground">Across all courses</p>
        </DashboardCard>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <DashboardCard title="Grade Distribution">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar dataKey="average" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        <DashboardCard title="Submission Trends">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <CartesianGrid strokeDasharray="3 3" />
                <Line type="monotone" dataKey="submissions" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}


import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Trophy, Award, Medal } from "lucide-react";

// Mock data
const students = [
  {
    id: "1",
    name: "Emma Wilson",
    rank: 1,
    department: "Computer Science",
    course: "Computer Science",
    year: 3,
    semester: 1,
    score: 95.8,
    change: "same" as const,
  },
  {
    id: "2",
    name: "Jason Rodriguez",
    rank: 2,
    department: "Computer Science",
    course: "Software Engineering",
    year: 4,
    semester: 1,
    score: 94.2,
    change: "up" as const,
  },
  {
    id: "3",
    name: "Sophia Chen",
    rank: 3,
    department: "Engineering",
    course: "Electrical Engineering",
    year: 3,
    semester: 1,
    score: 93.7,
    change: "up" as const,
  },
  {
    id: "4",
    name: "Michael Johnson",
    rank: 4,
    department: "Business",
    course: "Business Administration",
    year: 2,
    semester: 1,
    score: 92.5,
    change: "down" as const,
  },
  {
    id: "5",
    name: "Olivia Martinez",
    rank: 5,
    department: "Engineering",
    course: "Civil Engineering",
    year: 4,
    semester: 1,
    score: 91.9,
    change: "up" as const,
  },
  {
    id: "6",
    name: "Daniel Kim",
    rank: 6,
    department: "Computer Science",
    course: "Data Science",
    year: 3,
    semester: 1,
    score: 91.3,
    change: "same" as const,
  },
  {
    id: "7",
    name: "Emily Zhang",
    rank: 7,
    department: "Arts",
    course: "Graphic Design",
    year: 2,
    semester: 1,
    score: 90.8,
    change: "down" as const,
  },
  {
    id: "8",
    name: "Alexander Patel",
    rank: 8,
    department: "Computer Science",
    course: "Cybersecurity",
    year: 4,
    semester: 1,
    score: 90.2,
    change: "up" as const,
  },
  {
    id: "9",
    name: "Ava Thompson",
    rank: 9,
    department: "Business",
    course: "Marketing",
    year: 3,
    semester: 1,
    score: 89.7,
    change: "down" as const,
  },
  {
    id: "10",
    name: "Nathan Jackson",
    rank: 10,
    department: "Engineering",
    course: "Mechanical Engineering",
    year: 2,
    semester: 1,
    score: 89.1,
    change: "up" as const,
  },
];

export default function Leaderboard() {
  const [period, setPeriod] = useState("semester");

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="student" userName="Alex Johnson" />
      
      <main className="container py-6">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-display text-3xl font-bold">Academic Leaderboard</h1>
            <p className="text-muted-foreground">
              View top academic performers across departments
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Period:</span>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semester">Current Semester</SelectItem>
                <SelectItem value="year">Academic Year</SelectItem>
                <SelectItem value="alltime">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="mb-6 grid gap-6 md:grid-cols-3">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-yellow-400 to-yellow-500 pb-2 pt-2 text-white">
              <CardTitle className="text-center text-lg">🥇 First Place</CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-3 flex h-24 w-24 items-center justify-center rounded-full bg-yellow-100">
                <Trophy className="h-12 w-12 text-yellow-500" />
              </div>
              <h3 className="mb-1 text-xl font-bold">{students[0].name}</h3>
              <p className="mb-2 text-muted-foreground">{students[0].department}</p>
              <p className="text-2xl font-bold text-edu-purple">{students[0].score.toFixed(1)}</p>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-300 to-gray-400 pb-2 pt-2 text-white">
              <CardTitle className="text-center text-lg">🥈 Second Place</CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-3 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                <Medal className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="mb-1 text-xl font-bold">{students[1].name}</h3>
              <p className="mb-2 text-muted-foreground">{students[1].department}</p>
              <p className="text-2xl font-bold text-edu-purple">{students[1].score.toFixed(1)}</p>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-amber-600 to-amber-700 pb-2 pt-2 text-white">
              <CardTitle className="text-center text-lg">🥉 Third Place</CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-3 flex h-24 w-24 items-center justify-center rounded-full bg-amber-100">
                <Award className="h-12 w-12 text-amber-700" />
              </div>
              <h3 className="mb-1 text-xl font-bold">{students[2].name}</h3>
              <p className="mb-2 text-muted-foreground">{students[2].department}</p>
              <p className="text-2xl font-bold text-edu-purple">{students[2].score.toFixed(1)}</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overall" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-4 sm:w-[600px]">
            <TabsTrigger value="overall">Overall</TabsTrigger>
            <TabsTrigger value="department">By Department</TabsTrigger>
            <TabsTrigger value="course">By Course</TabsTrigger>
            <TabsTrigger value="year">By Year</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overall" className="mt-0">
            <LeaderboardTable students={students} />
          </TabsContent>
          
          <TabsContent value="department" className="mt-0">
            <LeaderboardTable students={students.filter(s => s.department === "Computer Science")} />
          </TabsContent>
          
          <TabsContent value="course" className="mt-0">
            <LeaderboardTable students={students.filter(s => s.year === 3)} />
          </TabsContent>
          
          <TabsContent value="year" className="mt-0">
            <LeaderboardTable students={students.filter(s => s.year === 4)} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

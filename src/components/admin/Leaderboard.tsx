
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Medal, Trophy, Award, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const topStudents = [
  { rank: 1, name: "Karthik", gpa: 4.0, department: "Computer Science", achievements: 5 },
  { rank: 2, name: "Greeshma", gpa: 3.95, department: "Data Science", achievements: 4 },
  { rank: 3, name: "Sujan", gpa: 3.92, department: "Engineering", achievements: 4 },
  { rank: 4, name: "Hema", gpa: 3.89, department: "Business", achievements: 3 },
];

export default function Leaderboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Top Performer"
          description="Highest GPA"
          icon={<Trophy className="text-yellow-500" />}
        >
          <p className="text-2xl font-bold">Karthik</p>
          <p className="text-sm text-muted-foreground">GPA: 4.0</p>
        </DashboardCard>

        <DashboardCard
          title="Most Improved"
          description="This semester"
          icon={<Award className="text-purple-500" />}
        >
          <p className="text-2xl font-bold">Hema</p>
          <p className="text-sm text-green-600">+0.5 GPA</p>
        </DashboardCard>

        <DashboardCard
          title="Achievement Leader"
          description="Most certifications"
          icon={<Medal className="text-blue-500" />}
        >
          <p className="text-2xl font-bold">5</p>
          <p className="text-sm text-muted-foreground">Certifications earned</p>
        </DashboardCard>

        <DashboardCard
          title="Honor Students"
          description="3.5+ GPA"
          icon={<Users className="text-green-500" />}
        >
          <p className="text-2xl font-bold">127</p>
          <p className="text-sm text-muted-foreground">Current semester</p>
        </DashboardCard>
      </div>

      <DashboardCard title="Top Performers">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>GPA</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Achievements</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topStudents.map((student) => (
              <TableRow key={student.rank}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {student.rank === 1 ? (
                      <Trophy className="h-5 w-5 text-yellow-500" />
                    ) : student.rank === 2 ? (
                      <Medal className="h-5 w-5 text-gray-400" />
                    ) : student.rank === 3 ? (
                      <Medal className="h-5 w-5 text-amber-600" />
                    ) : (
                      <span className="h-5 w-5 flex items-center justify-center">#{student.rank}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.gpa}</TableCell>
                <TableCell>{student.department}</TableCell>
                <TableCell>{student.achievements}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4">
          <Button variant="outline" className="w-full">View All Rankings</Button>
        </div>
      </DashboardCard>
    </div>
  );
}

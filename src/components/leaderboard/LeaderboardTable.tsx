
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Award, Medal, Search, TrendingUp, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface Student {
  id: string;
  name: string;
  rank: number;
  department: string;
  course: string;
  year: number;
  semester: number;
  score: number;
  change: "up" | "down" | "same";
}

interface LeaderboardTableProps {
  students: Student[];
  className?: string;
}

export function LeaderboardTable({ students: initialStudents, className }: LeaderboardTableProps) {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [department, setDepartment] = useState<string>("all");
  const [year, setYear] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearch = () => {
    let filtered = initialStudents;
    
    if (department !== "all") {
      filtered = filtered.filter(student => student.department === department);
    }
    
    if (year !== "all") {
      filtered = filtered.filter(student => student.year === parseInt(year));
    }
    
    if (searchTerm) {
      filtered = filtered.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.course.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setStudents(filtered);
  };

  const handleClear = () => {
    setDepartment("all");
    setYear("all");
    setSearchTerm("");
    setStudents(initialStudents);
  };

  return (
    <div className={className}>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Search by name or course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-[300px]"
          />
          <Button size="sm" variant="secondary" onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
          <Button size="sm" variant="outline" onClick={handleClear}>
            Clear
          </Button>
        </div>
        <div className="flex gap-2">
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Computer Science">Computer Science</SelectItem>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Business">Business</SelectItem>
              <SelectItem value="Arts">Arts</SelectItem>
            </SelectContent>
          </Select>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              <SelectItem value="1">First Year</SelectItem>
              <SelectItem value="2">Second Year</SelectItem>
              <SelectItem value="3">Third Year</SelectItem>
              <SelectItem value="4">Fourth Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px] text-center">Rank</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Course</TableHead>
              <TableHead className="hidden md:table-cell">Year</TableHead>
              <TableHead className="hidden md:table-cell">Semester</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead className="w-[100px] text-center">Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center">
                      {student.rank <= 3 ? (
                        <div className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full text-white",
                          student.rank === 1 ? "bg-yellow-500" : 
                          student.rank === 2 ? "bg-gray-400" : 
                          "bg-amber-700"
                        )}>
                          {student.rank === 1 ? 
                            <Trophy className="h-4 w-4" /> : 
                            student.rank === 2 ? 
                              <Medal className="h-4 w-4" /> : 
                              <Award className="h-4 w-4" />
                          }
                        </div>
                      ) : (
                        <span className="text-sm font-medium">{student.rank}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{student.name}</div>
                  </TableCell>
                  <TableCell>{student.department}</TableCell>
                  <TableCell>{student.course}</TableCell>
                  <TableCell className="hidden md:table-cell">{student.year}</TableCell>
                  <TableCell className="hidden md:table-cell">{student.semester}</TableCell>
                  <TableCell className="text-right font-medium">{student.score.toFixed(1)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      {student.change === "up" && (
                        <div className="flex items-center text-green-500">
                          <TrendingUp className="mr-1 h-4 w-4" />
                          <span className="text-xs">Up</span>
                        </div>
                      )}
                      {student.change === "down" && (
                        <div className="flex items-center text-red-500">
                          <TrendingUp className="mr-1 h-4 w-4 rotate-180" />
                          <span className="text-xs">Down</span>
                        </div>
                      )}
                      {student.change === "same" && (
                        <div className="flex items-center text-gray-500">
                          <span className="text-xs">Same</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

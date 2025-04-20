
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Student {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface Course {
  id: number;
  name: string;
  credits: number;
}

interface Grade {
  id?: number;
  course_id: string;
  student_id: string;
  grade: number;
  term: string;
  year: number;
  notes: string;
  locked: boolean;
  student?: Student;
  course?: Course;
}

export default function Admin() {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isAddingStudentOpen, setIsAddingStudentOpen] = useState(false);
  const [isAddingCourseOpen, setIsAddingCourseOpen] = useState(false);
  const [isAddingGradeOpen, setIsAddingGradeOpen] = useState(false);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [isAddingGrade, setIsAddingGrade] = useState(false);
  const [newStudent, setNewStudent] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [newCourse, setNewCourse] = useState({
    name: '',
    credits: 3
  });
  const [newGrade, setNewGrade] = useState<Omit<Grade, 'id' | 'locked'>>({
    course_id: '',
    student_id: '',
    grade: 0,
    term: 'Fall',
    year: new Date().getFullYear(),
    notes: ''
  });

  useEffect(() => {
    fetchStudents();
    fetchCourses();
    fetchGrades();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student');

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast({
        title: "Error",
        description: "Failed to fetch students",
        variant: "destructive"
      });
    }
  };

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*');

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast({
        title: "Error",
        description: "Failed to fetch courses",
        variant: "destructive"
      });
    }
  };

  const fetchGrades = async () => {
    try {
      const { data, error } = await supabase
        .from('grades')
        .select(`
          *,
          student:student_id (
            id,
            email,
            first_name,
            last_name
          ),
          course:course_id (
            id,
            name,
            credits
          )
        `);

      if (error) throw error;
      setGrades(data || []);
    } catch (error) {
      console.error("Error fetching grades:", error);
      toast({
        title: "Error",
        description: "Failed to fetch grades",
        variant: "destructive"
      });
    }
  };

  const addStudent = async () => {
    if (!newStudent.fullName || !newStudent.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsAddingStudent(true);

      // Split the full name into first and last name
      const nameParts = newStudent.fullName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Generate a UUID for the new profile
      const newId = crypto.randomUUID();

      const { error } = await supabase
        .from('profiles')
        .insert({
          id: newId,
          email: newStudent.email,
          first_name: firstName,
          last_name: lastName,
          role: 'student'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Student added successfully"
      });

      setNewStudent({
        fullName: '',
        email: '',
        password: ''
      });

      setIsAddingStudentOpen(false);
      fetchStudents();
    } catch (error) {
      console.error("Error adding student:", error);
      toast({
        title: "Error",
        description: "Failed to add student. " + (error as Error).message,
        variant: "destructive"
      });
    } finally {
      setIsAddingStudent(false);
    }
  };

  const addCourse = async () => {
    if (!newCourse.name || !newCourse.credits) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsAddingCourse(true);

      const { error } = await supabase
        .from('courses')
        .insert({
          name: newCourse.name,
          credits: newCourse.credits
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Course added successfully"
      });

      setNewCourse({
        name: '',
        credits: 3
      });

      setIsAddingCourseOpen(false);
      fetchCourses();
    } catch (error) {
      console.error("Error adding course:", error);
      toast({
        title: "Error",
        description: "Failed to add course. " + (error as Error).message,
        variant: "destructive"
      });
    } finally {
      setIsAddingCourse(false);
    }
  };

  const addGrade = async () => {
    if (!newGrade.course_id || !newGrade.student_id || !newGrade.grade || !newGrade.term || !newGrade.year) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsAddingGrade(true);

      const { error } = await supabase
        .from('grades')
        .insert({
          course_id: newGrade.course_id.toString(), // Convert number to string
          student_id: newGrade.student_id,
          grade: newGrade.grade,
          term: newGrade.term,
          year: newGrade.year,
          notes: newGrade.notes,
          locked: false
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Grade added successfully"
      });

      setNewGrade({
        course_id: '',
        student_id: '',
        grade: 0,
        term: 'Fall',
        year: new Date().getFullYear(),
        notes: ''
      });

      setIsAddingGradeOpen(false);
      fetchGrades();
    } catch (error) {
      console.error("Error adding grade:", error);
      toast({
        title: "Error",
        description: "Failed to add grade. " + (error as Error).message,
        variant: "destructive"
      });
    } finally {
      setIsAddingGrade(false);
    }
  };

  return (
    <div className="container py-6">
      <h1 className="mb-6 font-display text-3xl font-bold">Admin Panel</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Manage Students</CardTitle>
            <CardDescription>Add, edit, or remove student accounts.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.first_name} {student.last_name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mt-4 w-full" variant="outline">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                  <DialogDescription>
                    Create a new student account by entering their details below.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={newStudent.fullName}
                      onChange={(e) => setNewStudent({ ...newStudent, fullName: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={newStudent.email}
                      onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" onClick={addStudent} disabled={isAddingStudent}>
                    {isAddingStudent ? "Adding..." : "Add Student"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manage Courses</CardTitle>
            <CardDescription>Add, edit, or remove courses from the catalog.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Credits</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>{course.name}</TableCell>
                    <TableCell>{course.credits}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mt-4 w-full" variant="outline">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Course
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Course</DialogTitle>
                  <DialogDescription>
                    Create a new course by entering the details below.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="courseName" className="text-right">
                      Course Name
                    </Label>
                    <Input
                      id="courseName"
                      value={newCourse.name}
                      onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="credits" className="text-right">
                      Credits
                    </Label>
                    <Input
                      id="credits"
                      type="number"
                      value={newCourse.credits}
                      onChange={(e) => setNewCourse({ ...newCourse, credits: parseInt(e.target.value) })}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" onClick={addCourse} disabled={isAddingCourse}>
                    {isAddingCourse ? "Adding..." : "Add Course"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Manage Grades</CardTitle>
          <CardDescription>Add, edit, or remove grades for students.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Term</TableHead>
                <TableHead>Year</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grades.map((grade) => (
                <TableRow key={grade.id}>
                  <TableCell>{grade.student?.first_name} {grade.student?.last_name}</TableCell>
                  <TableCell>{grade.course?.name}</TableCell>
                  <TableCell>{grade.grade}</TableCell>
                  <TableCell>{grade.term}</TableCell>
                  <TableCell>{grade.year}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mt-4 w-full" variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Grade
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add New Grade</DialogTitle>
                <DialogDescription>
                  Create a new grade entry by entering the details below.
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="studentId" className="text-right">
                      Student
                    </Label>
                    <Select onValueChange={(value) => setNewGrade({ ...newGrade, student_id: value })}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a student" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.first_name} {student.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="courseId" className="text-right">
                      Course
                    </Label>
                    <Select onValueChange={(value) => setNewGrade({ ...newGrade, course_id: value })}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id.toString()}>
                            {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="grade" className="text-right">
                      Grade
                    </Label>
                    <Input
                      id="grade"
                      type="number"
                      value={newGrade.grade}
                      onChange={(e) => setNewGrade({ ...newGrade, grade: parseFloat(e.target.value) })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="term" className="text-right">
                      Term
                    </Label>
                    <Select onValueChange={(value) => setNewGrade({ ...newGrade, term: value })}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a term" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fall">Fall</SelectItem>
                        <SelectItem value="Winter">Winter</SelectItem>
                        <SelectItem value="Spring">Spring</SelectItem>
                        <SelectItem value="Summer">Summer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="year" className="text-right">
                      Year
                    </Label>
                    <Input
                      id="year"
                      type="number"
                      value={newGrade.year}
                      onChange={(e) => setNewGrade({ ...newGrade, year: parseInt(e.target.value) })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="text-right">
                      Notes
                    </Label>
                    <Input
                      id="notes"
                      type="text"
                      value={newGrade.notes}
                      onChange={(e) => setNewGrade({ ...newGrade, notes: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                </div>
              </ScrollArea>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <Button type="submit" onClick={addGrade} disabled={isAddingGrade}>
                  {isAddingGrade ? "Adding..." : "Add Grade"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}

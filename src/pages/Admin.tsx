// src/pages/Admin.tsx
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

export default function Admin() {
  const [profiles, setProfiles] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewProfileForm, setShowNewProfileForm] = useState(false);
  const [showNewCourseForm, setShowNewCourseForm] = useState(false);
  const [newProfileEmail, setNewProfileEmail] = useState("");
  const [newProfileFirstName, setNewProfileFirstName] = useState("");
  const [newProfileLastName, setNewProfileLastName] = useState("");
  const [newProfileRole, setNewProfileRole] = useState("student");
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseDescription, setNewCourseDescription] = useState("");
  const [newCourseCourseId, setNewCourseCourseId] = useState("");
  const [newCourseCredits, setNewCourseCredits] = useState(3);
  const [newCourseDepartment, setNewCourseDepartment] = useState("");
  const [newCourseProfessorId, setNewCourseProfessorId] = useState("");
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [professorOptions, setProfessorOptions] = useState([]);

  useEffect(() => {
    fetchProfiles();
    fetchCourses();
    fetchProfessors();
  }, []);

  const fetchProfiles = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch profiles",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCourses = async () => {
    setIsLoading(true);
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
        description: error instanceof Error ? error.message : "Failed to fetch courses",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfessors = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .eq('role', 'professor');

      if (error) throw error;

      // Map the data to the format expected by the Select component
      const options = data.map(professor => ({
        value: professor.id,
        label: `${professor.first_name} ${professor.last_name} (${professor.id})`
      }));

      setProfessorOptions(options);
    } catch (error) {
      console.error("Error fetching professors:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch professors",
        variant: "destructive"
      });
    }
  };

  const createProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingProfile(true);
    
    try {
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newProfileEmail,
        password: "password123", // Set a default password
        email_confirm: true,
        user_metadata: {
          full_name: `${newProfileFirstName} ${newProfileLastName}`,
          role: newProfileRole
        }
      });
      
      if (authError) throw authError;
      
      if (!authData.user) {
        throw new Error("Failed to create user");
      }
      
      // Then insert the profile with the user ID
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id, // Use the ID from the created auth user
          email: newProfileEmail,
          first_name: newProfileFirstName,
          last_name: newProfileLastName,
          role: newProfileRole
        });
      
      if (profileError) throw profileError;
      
      toast({
        title: "Success",
        description: `Created new ${newProfileRole}: ${newProfileFirstName} ${newProfileLastName}`
      });
      
      // Reset form and refresh profiles
      setNewProfileEmail("");
      setNewProfileFirstName("");
      setNewProfileLastName("");
      setNewProfileRole("student");
      fetchProfiles();
      setShowNewProfileForm(false);
    } catch (error) {
      console.error("Error creating profile:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create profile",
        variant: "destructive"
      });
    } finally {
      setIsCreatingProfile(false);
    }
  };

  const createCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingCourse(true);

    try {
      // Convert the course_id to a string before saving
      const { error } = await supabase
        .from('courses')
        .insert({
          title: newCourseTitle,
          description: newCourseDescription,
          course_id: String(newCourseCourseId), // Convert to string
          credits: newCourseCredits,
          department: newCourseDepartment,
          professor_id: newCourseProfessorId
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Created new course: ${newCourseTitle}`
      });

      // Reset form and refresh courses
      setNewCourseTitle("");
      setNewCourseDescription("");
      setNewCourseCourseId("");
      setNewCourseCredits(3);
      setNewCourseDepartment("");
      setNewCourseProfessorId("");
      fetchCourses();
      setShowNewCourseForm(false);
    } catch (error) {
      console.error("Error creating course:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create course",
        variant: "destructive"
      });
    } finally {
      setIsCreatingCourse(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Profiles Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Profiles</h2>
          <Button onClick={() => setShowNewProfileForm(!showNewProfileForm)}>
            {showNewProfileForm ? "Hide Form" : "Add New Profile"}
          </Button>
        </div>

        {showNewProfileForm && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Create New Profile</CardTitle>
              <CardDescription>Fill in the details to create a new user profile.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={createProfile} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={newProfileEmail}
                    onChange={(e) => setNewProfileEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="First Name"
                    value={newProfileFirstName}
                    onChange={(e) => setNewProfileFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Last Name"
                    value={newProfileLastName}
                    onChange={(e) => setNewProfileLastName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={newProfileRole} onValueChange={(value) => setNewProfileRole(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="professor">Professor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" disabled={isCreatingProfile}>
                  {isCreatingProfile ? "Creating..." : "Create Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Current Profiles</CardTitle>
            <CardDescription>Manage existing user profiles.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading profiles...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>First Name</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead>Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiles.map((profile) => (
                    <TableRow key={profile.id}>
                      <TableCell>{profile.id}</TableCell>
                      <TableCell>{profile.email}</TableCell>
                      <TableCell>{profile.first_name}</TableCell>
                      <TableCell>{profile.last_name}</TableCell>
                      <TableCell>{profile.role}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Courses Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Courses</h2>
          <Button onClick={() => setShowNewCourseForm(!showNewCourseForm)}>
            {showNewCourseForm ? "Hide Form" : "Add New Course"}
          </Button>
        </div>

        {showNewCourseForm && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Create New Course</CardTitle>
              <CardDescription>Fill in the details to create a new course.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={createCourse} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Title"
                    value={newCourseTitle}
                    onChange={(e) => setNewCourseTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    type="text"
                    placeholder="Description"
                    value={newCourseDescription}
                    onChange={(e) => setNewCourseDescription(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="courseId">Course ID</Label>
                  <Input
                    id="courseId"
                    type="text"
                    placeholder="Course ID"
                    value={newCourseCourseId}
                    onChange={(e) => setNewCourseCourseId(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="credits">Credits</Label>
                  <Input
                    id="credits"
                    type="number"
                    placeholder="Credits"
                    value={newCourseCredits}
                    onChange={(e) => setNewCourseCredits(Number(e.target.value))}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    type="text"
                    placeholder="Department"
                    value={newCourseDepartment}
                    onChange={(e) => setNewCourseDepartment(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="professor">Professor</Label>
                  <Select
                    onValueChange={setNewCourseProfessorId}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a professor" />
                    </SelectTrigger>
                    <SelectContent>
                      {professorOptions.map((professor) => (
                        <SelectItem key={professor.value} value={professor.value}>
                          {professor.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" disabled={isCreatingCourse}>
                  {isCreatingCourse ? "Creating..." : "Create Course"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Current Courses</CardTitle>
            <CardDescription>Manage existing courses.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading courses...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Professor ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.course_id}>
                      <TableCell>{course.course_id}</TableCell>
                      <TableCell>{course.title}</TableCell>
                      <TableCell>{course.description}</TableCell>
                      <TableCell>{course.credits}</TableCell>
                      <TableCell>{course.department}</TableCell>
                      <TableCell>{course.professor_id}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

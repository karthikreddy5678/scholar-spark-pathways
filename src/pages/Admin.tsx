import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = z.object({
  emailUpdates: z.boolean().default(true),
})

export default function Admin() {
  const [students, setStudents] = useState([]);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student');

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch students",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStudent = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setIsLoading(true);

      // First, create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: generateTemporaryPassword(),
        options: {
          data: {
            full_name: `${firstName} ${lastName}`,
            role: 'student'
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Failed to create user");

      // Now create the profile with the auth user's ID
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email,
          first_name: firstName,
          last_name: lastName,
          role: 'student'
        });

      if (profileError) throw profileError;

      toast({
        title: "Success",
        description: "Student account created successfully"
      });

      // Reset form
      setEmail('');
      setFirstName('');
      setLastName('');
      
      // Refresh student list
      await fetchStudents();
    } catch (error) {
      console.error('Error adding student:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create student account",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.admin.deleteUser(studentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Student account deleted successfully"
      });

      // Refresh student list
      await fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete student account",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailUpdates: true,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <div className="container py-6">
      <h1 className="mb-6 font-display text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Add New Student</CardTitle>
            <CardDescription>Create a new student account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Student"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manage Students</CardTitle>
            <CardDescription>View and manage existing student accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>A list of your registered students.</TableCaption>
              <TableHead>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student: any) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.first_name} {student.last_name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteStudent(student.id)}
                        disabled={isLoading}
                      >
                        {isLoading ? "Deleting..." : "Delete"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="emailUpdates"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Email updates</FormLabel>
                      <FormDescription>
                        Receive email updates about your account.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper function to generate a temporary password
function generateTemporaryPassword(): string {
  return Math.random().toString(36).slice(-8);
}

const FormDescription = ({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => {
  return (
    <p
      className="text-sm text-muted-foreground"
      {...props}
    >
      {children}
    </p>
  )
}

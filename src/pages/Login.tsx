
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, AtSign, Lock, Eye, EyeOff, User, Key, UserCog, Building, ShieldCheck } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const navigate = useNavigate();
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would authenticate the user
    navigate("/");
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would authenticate the admin
    navigate("/admin");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-edu-purple-light/20 via-background to-edu-blue/10 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center">
            <GraduationCap className="mr-2 h-8 w-8 text-edu-purple" />
            <h1 className="font-display text-3xl font-bold text-edu-purple">ScholarSpark</h1>
          </div>
          <p className="mt-2 text-muted-foreground">Intelligent Student Management System</p>
        </div>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="login">Student</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Student Login</CardTitle>
                <CardDescription>
                  Enter your credentials to access your student account
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="name@university.edu" 
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <a 
                        href="#" 
                        className="text-xs text-muted-foreground underline-offset-2 hover:text-edu-purple hover:underline"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        className="pl-10 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-10 w-10 text-muted-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">Toggle password visibility</span>
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="remember" 
                      className="h-4 w-4 rounded border-gray-300 text-edu-purple focus:ring-edu-purple"
                    />
                    <label htmlFor="remember" className="text-sm text-muted-foreground">
                      Remember me
                    </label>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full bg-edu-purple hover:bg-edu-purple-dark">
                    Sign In
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="admin">
            <Card className="border-edu-purple/30">
              <CardHeader className="bg-edu-purple/5">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <UserCog className="h-5 w-5 text-edu-purple" />
                      Admin Login
                    </CardTitle>
                    <CardDescription>
                      Secure access for administrators and faculty
                    </CardDescription>
                  </div>
                  <ShieldCheck className="h-8 w-8 text-edu-purple opacity-70" />
                </div>
              </CardHeader>
              <form onSubmit={handleAdminLogin}>
                <CardContent className="space-y-4 pt-5">
                  <div className="space-y-2">
                    <Label htmlFor="admin-id">Admin ID</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="admin-id" 
                        type="text" 
                        placeholder="ADM-12345" 
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="institution">Institution</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="institution" 
                        type="text" 
                        placeholder="University Name" 
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="admin-password">Password</Label>
                      <a 
                        href="#" 
                        className="text-xs text-muted-foreground underline-offset-2 hover:text-edu-purple hover:underline"
                      >
                        Reset credentials
                      </a>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="admin-password" 
                        type={showAdminPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        className="pl-10 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-10 w-10 text-muted-foreground"
                        onClick={() => setShowAdminPassword(!showAdminPassword)}
                      >
                        {showAdminPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">Toggle password visibility</span>
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="admin-remember" 
                        className="h-4 w-4 rounded border-gray-300 text-edu-purple focus:ring-edu-purple"
                      />
                      <label htmlFor="admin-remember" className="text-sm text-muted-foreground">
                        Remember me
                      </label>
                    </div>
                    <div>
                      <select className="text-xs bg-transparent border-none text-muted-foreground focus:ring-0">
                        <option value="admin">Administrator</option>
                        <option value="professor">Professor</option>
                        <option value="staff">Staff</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full bg-edu-purple hover:bg-edu-purple-dark">
                    Secure Login
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                  Enter your details to register for ScholarSpark
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="first-name" placeholder="John" className="pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-id">Student ID</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="student-id" placeholder="1234567890" className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="reg-email" type="email" placeholder="name@university.edu" className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="reg-password" type="password" placeholder="••••••••" className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input id="confirm-password" type="password" placeholder="••••••••" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-edu-purple hover:bg-edu-purple-dark">Register</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 rounded-lg border bg-card p-4 text-center text-sm text-muted-foreground">
          <p>Demo accounts:</p>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-md bg-muted p-2">
              <p className="font-semibold">Student</p>
              <p>student@university.edu</p>
              <p>password123</p>
            </div>
            <div className="rounded-md bg-muted p-2">
              <p className="font-semibold">Admin</p>
              <p>admin@university.edu</p>
              <p>admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

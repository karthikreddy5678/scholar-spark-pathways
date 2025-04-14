
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, AtSign, Lock, Eye, EyeOff, User, Key } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would authenticate the user
    navigate("/");
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome back</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
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
              <p className="font-semibold">Teacher</p>
              <p>teacher@university.edu</p>
              <p>password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

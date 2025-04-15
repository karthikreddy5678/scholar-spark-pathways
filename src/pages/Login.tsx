
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, AtSign, Lock, Eye, EyeOff, User, Building } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  
  const handleLogin = (e: React.FormEvent, role: 'student' | 'professor') => {
    e.preventDefault();
    // In a real app, this would authenticate with a backend
    if (email && password) {
      toast({
        title: "Success",
        description: `Logged in as ${role}`
      });
      navigate(role === 'professor' ? '/admin' : '/dashboard');
    } else {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-edu-purple-light/20 via-background to-edu-blue/10">
      <div className="w-full max-w-md px-4">
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center">
            <GraduationCap className="mr-2 h-8 w-8 text-edu-purple" />
            <h1 className="font-display text-3xl font-bold text-edu-purple">ScholarSpark</h1>
          </div>
          <p className="mt-2 text-muted-foreground">Intelligent Student Management System</p>
        </div>
        
        <Tabs defaultValue="student" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="student">Student</TabsTrigger>
            <TabsTrigger value="professor">Professor</TabsTrigger>
          </TabsList>
          
          <TabsContent value="student">
            <Card className="border-edu-purple/30">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <User className="h-5 w-5 text-edu-purple" />
                  Student Login
                </CardTitle>
                <CardDescription>
                  Sign in to access your academic dashboard
                </CardDescription>
              </CardHeader>
              <form onSubmit={(e) => handleLogin(e, 'student')}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="student@university.edu" 
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Button 
                        variant="link" 
                        className="px-0 text-xs text-muted-foreground hover:text-edu-purple"
                      >
                        Forgot password?
                      </Button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        className="pl-10 pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-10 w-10 text-muted-foreground hover:text-edu-purple"
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
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label htmlFor="remember" className="text-sm text-muted-foreground">
                      Remember me
                    </label>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full bg-edu-purple hover:bg-edu-purple/90">
                    Sign In
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="professor">
            <Card className="border-edu-purple/30">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Building className="h-5 w-5 text-edu-purple" />
                  Professor Login
                </CardTitle>
                <CardDescription>
                  Access your administrative dashboard
                </CardDescription>
              </CardHeader>
              <form onSubmit={(e) => handleLogin(e, 'professor')}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="prof-email">Email</Label>
                    <div className="relative">
                      <AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="prof-email" 
                        type="email" 
                        placeholder="professor@university.edu" 
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="prof-password">Password</Label>
                      <Button 
                        variant="link" 
                        className="px-0 text-xs text-muted-foreground hover:text-edu-purple"
                      >
                        Reset credentials
                      </Button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="prof-password" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        className="pl-10 pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-10 w-10 text-muted-foreground hover:text-edu-purple"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">Toggle password visibility</span>
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="prof-remember" 
                        className="h-4 w-4 rounded border-gray-300 text-edu-purple focus:ring-edu-purple"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <label htmlFor="prof-remember" className="text-sm text-muted-foreground">
                        Remember me
                      </label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full bg-edu-purple hover:bg-edu-purple/90">
                    Secure Login
                  </Button>
                </CardFooter>
              </form>
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
              <p className="font-semibold">Professor</p>
              <p>professor@university.edu</p>
              <p>admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

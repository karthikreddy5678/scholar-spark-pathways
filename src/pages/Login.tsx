import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, AtSign, Lock, Eye, EyeOff, User, Building, UserPlus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export default function Login() {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  
  const handleRegister = async (e: React.FormEvent, role: 'student' | 'professor') => {
    e.preventDefault();
    
    if (!email || !password || !fullName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Use proper domain for role-based email
      const emailToUse = role === 'professor' 
        ? email.includes('@') ? email : `${email}@professor.university.edu`
        : email.includes('@') ? email : `${email}@university.edu`;
      
      const { data, error } = await supabase.auth.signUp({
        email: emailToUse,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Registration Successful",
        description: "Your account has been created. You can now log in.",
      });
      
      // Clear registration form
      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      // Switch to login tab
      setActiveTab("login");
      
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "An error occurred during registration",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogin = async (e: React.FormEvent, role: 'student' | 'professor') => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Use proper domain for role-based email if not already provided
      const emailToUse = role === 'professor'
        ? email.includes('@') ? email : `${email}@professor.university.edu`
        : email.includes('@') ? email : `${email}@university.edu`;
      
      await signIn(emailToUse, password);
      
      // Navigation is handled in the signIn function in AuthContext
      
    } catch (error) {
      console.error("Login error:", error);
      // Toast is shown in AuthContext
    } finally {
      setIsLoading(false);
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
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
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
                            type="text" 
                            placeholder="username or full email" 
                            className="pl-10"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">Password</Label>
                          <Button 
                            variant="link" 
                            className="px-0 text-xs text-muted-foreground hover:text-edu-purple"
                            type="button"
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
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-10 w-10 text-muted-foreground hover:text-edu-purple"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
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
                          disabled={isLoading}
                        />
                        <label htmlFor="remember" className="text-sm text-muted-foreground">
                          Remember me
                        </label>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        type="submit" 
                        className="w-full bg-edu-purple hover:bg-edu-purple/90"
                        disabled={isLoading}
                      >
                        {isLoading ? "Signing In..." : "Sign In"}
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
                            type="text" 
                            placeholder="username or full email" 
                            className="pl-10"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="prof-password">Password</Label>
                          <Button 
                            variant="link" 
                            className="px-0 text-xs text-muted-foreground hover:text-edu-purple"
                            type="button"
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
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-10 w-10 text-muted-foreground hover:text-edu-purple"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
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
                            disabled={isLoading}
                          />
                          <label htmlFor="prof-remember" className="text-sm text-muted-foreground">
                            Remember me
                          </label>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        type="submit" 
                        className="w-full bg-edu-purple hover:bg-edu-purple/90"
                        disabled={isLoading}
                      >
                        {isLoading ? "Signing In..." : "Secure Login"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>
          
          <TabsContent value="register">
            <Tabs defaultValue="student" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="student">Student</TabsTrigger>
                <TabsTrigger value="professor">Professor</TabsTrigger>
              </TabsList>
              
              <TabsContent value="student">
                <Card className="border-edu-purple/30">
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <UserPlus className="h-5 w-5 text-edu-purple" />
                      Student Registration
                    </CardTitle>
                    <CardDescription>
                      Create your student account
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={(e) => handleRegister(e, 'student')}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input 
                          id="fullName" 
                          type="text" 
                          placeholder="John Doe" 
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reg-email">Email</Label>
                        <div className="relative">
                          <AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="reg-email" 
                            type="text" 
                            placeholder="username or full email" 
                            className="pl-10"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          If you don't provide a full email, we'll use username@university.edu
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reg-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="reg-password" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            className="pl-10 pr-10"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-10 w-10 text-muted-foreground hover:text-edu-purple"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            <span className="sr-only">Toggle password visibility</span>
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <Input 
                          id="confirm-password" 
                          type="password" 
                          placeholder="••••••••" 
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        type="submit" 
                        className="w-full bg-edu-purple hover:bg-edu-purple/90"
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating Account..." : "Create Account"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>

              <TabsContent value="professor">
                <Card className="border-edu-purple/30">
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <UserPlus className="h-5 w-5 text-edu-purple" />
                      Professor Registration
                    </CardTitle>
                    <CardDescription>
                      Create your professor account
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={(e) => handleRegister(e, 'professor')}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="prof-fullName">Full Name</Label>
                        <Input 
                          id="prof-fullName" 
                          type="text" 
                          placeholder="Dr. Jane Smith" 
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="prof-reg-email">Email</Label>
                        <div className="relative">
                          <AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="prof-reg-email" 
                            type="text" 
                            placeholder="username or full email" 
                            className="pl-10"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          If you don't provide a full email, we'll use username@professor.university.edu
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="prof-reg-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="prof-reg-password" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            className="pl-10 pr-10"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-10 w-10 text-muted-foreground hover:text-edu-purple"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            <span className="sr-only">Toggle password visibility</span>
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="prof-confirm-password">Confirm Password</Label>
                        <Input 
                          id="prof-confirm-password" 
                          type="password" 
                          placeholder="••••••••" 
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        type="submit" 
                        className="w-full bg-edu-purple hover:bg-edu-purple/90"
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating Account..." : "Create Account"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
            </Tabs>
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

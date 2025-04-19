
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Moon, Sun } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { signIn, theme, toggleTheme } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      // No need to navigate here as the AuthProvider will handle it
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <div className="absolute top-4 right-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleTheme}
          className="rounded-full"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
      </div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary">EduTrack</h1>
          <p className="text-muted-foreground mt-2">Learning Management System</p>
        </div>
        
        <div className="bg-card rounded-lg border shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">Login to your account</h2>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-primary hover:underline"
                  onClick={() => toast({
                    title: "Password Reset",
                    description: "Password reset functionality is not implemented in this demo."
                  })}
                >
                  Forgot password?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full"
                disabled={isLoading}
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-edu-purple hover:bg-edu-purple/90"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
            
            <div className="text-center text-sm text-muted-foreground">
              <p>Demo Accounts:</p>
              <div className="mt-1 grid gap-1">
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => {
                    setEmail("professor@example.com");
                    setPassword("password123");
                  }}
                >
                  Professor (Admin)
                </button>
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => {
                    setEmail("student@example.com");
                    setPassword("password123");
                  }}
                >
                  Student
                </button>
              </div>
            </div>
          </form>
        </div>
        
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>© 2025 EduTrack LMS. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

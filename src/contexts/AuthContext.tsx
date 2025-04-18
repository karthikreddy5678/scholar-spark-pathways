
import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{
    user: User | null;
    session: Session | null;
  } | undefined>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.email);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Initial session check:", currentSession?.user?.email);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      // Check user_metadata first for role
      const userMetadataRole = user.user_metadata?.role;
      console.log("User metadata role:", userMetadataRole);
      
      // Get user profile data with role
      const fetchUserProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error("Error fetching user profile:", error);
          return;
        }
        
        console.log("User profile from database:", data);
        
        // Prioritize role from user_metadata if available
        const roleToUse = userMetadataRole || data?.role;
        console.log("Using role:", roleToUse);
        
        const isUserAdmin = roleToUse === 'professor';
        setIsAdmin(isUserAdmin);
        
        // Handle redirection after login based on role
        if (location.pathname === '/login') {
          const redirectTo = isUserAdmin ? '/admin' : '/dashboard';
          console.log(`Redirecting to ${redirectTo} based on role:`, roleToUse);
          navigate(redirectTo, { replace: true });
        }
      };
      
      // Use setTimeout to prevent potential deadlock with onAuthStateChange
      setTimeout(() => {
        fetchUserProfile();
      }, 0);
    }
  }, [user, navigate, location.pathname]);

  // Redirect to login if user is not authenticated and trying to access protected routes
  useEffect(() => {
    if (!isLoading && !user) {
      const protectedRoutes = ['/dashboard', '/admin', '/grades', '/courses', '/leaderboard'];
      if (protectedRoutes.includes(location.pathname)) {
        console.log("Redirecting to login from protected route:", location.pathname);
        navigate('/login', { replace: true });
      }
    }
  }, [user, isLoading, location.pathname, navigate]);

  const signIn = async (email: string, password: string) => {
    console.log("Attempting signin with:", email);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        // Special handling for email not confirmed error
        if (error.message === "Email not confirmed") {
          toast({
            title: "Email not confirmed",
            description: "For testing, disable email confirmation in your Supabase settings",
            variant: "destructive"
          });
          
          // For development, attempt to verify the email automatically
          try {
            console.log("Attempting to auto-verify email for development...");
            // This won't work in production - only for development
            const { error: verifyError } = await supabase.auth.admin.updateUserById(
              data?.user?.id || "",
              { email_confirm: true }
            );
            
            if (verifyError) {
              console.error("Auto-verification failed:", verifyError);
              throw error; // Throw original error
            } else {
              toast({
                title: "Auto-verification attempted",
                description: "Please try logging in again",
              });
              return { user: null, session: null };
            }
          } catch (verifyErr) {
            console.error("Auto-verification error:", verifyErr);
            throw error; // Throw original error
          }
        } else {
          throw error;
        }
      }
      
      console.log("Sign in successful:", data);
      return data;
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out"
      });
      
      navigate('/login');
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive"
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signIn, signOut, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

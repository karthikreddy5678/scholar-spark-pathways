
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
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Get theme preference from localStorage or default to 'light'
const getInitialTheme = (): 'light' | 'dark' => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || savedTheme === 'light') {
    return savedTheme;
  }
  
  // Check for system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'light';
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Apply theme to document root
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.email);
        
        if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          setIsLoading(false);
          navigate('/login', { replace: true });
          return;
        }
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Initial session check:", currentSession?.user?.email);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      const userMetadataRole = user.user_metadata?.role;
      console.log("User metadata role:", userMetadataRole);
      
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
        
        const roleToUse = userMetadataRole || data?.role;
        console.log("Using role:", roleToUse);
        
        const isUserAdmin = roleToUse === 'professor';
        setIsAdmin(isUserAdmin);
        
        if (location.pathname === '/login') {
          const redirectTo = isUserAdmin ? '/admin' : '/dashboard';
          console.log(`Redirecting to ${redirectTo} based on role:`, roleToUse);
          navigate(redirectTo, { replace: true });
        }
      };
      
      setTimeout(() => {
        fetchUserProfile();
      }, 0);
    }
  }, [user, navigate, location.pathname]);

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
        if (error.message === "Email not confirmed") {
          toast({
            title: "Email not confirmed",
            description: "For testing, disable email confirmation in your Supabase settings",
            variant: "destructive"
          });
          
          try {
            console.log("Attempting to auto-verify email for development...");
            const { error: verifyError } = await supabase.auth.admin.updateUserById(
              data?.user?.id || "",
              { email_confirm: true }
            );
            
            if (verifyError) {
              console.error("Auto-verification failed:", verifyError);
              throw error;
            } else {
              toast({
                title: "Auto-verification attempted",
                description: "Please try logging in again",
              });
              return { user: null, session: null };
            }
          } catch (verifyErr) {
            console.error("Auto-verification error:", verifyErr);
            throw error;
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
      
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out"
      });
      
      navigate('/login', { replace: true });
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
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isLoading, 
      signIn, 
      signOut, 
      isAdmin,
      theme,
      toggleTheme
    }}>
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

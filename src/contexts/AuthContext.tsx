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
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.email);
        
        if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
          // Clear all auth state
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          setIsLoading(false);
          // Force clear Supabase session storage
          localStorage.removeItem('supabase.auth.token');
          // Redirect to login
          navigate('/login', { replace: true });
          return;
        }
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    const checkSession = async () => {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Session check error:", error);
        setSession(null);
        setUser(null);
        setIsLoading(false);
        navigate('/login', { replace: true });
        return;
      }
      
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    };

    checkSession();
    return () => subscription.unsubscribe();
  }, [navigate]);

  // Enhanced role validation
  useEffect(() => {
    if (user) {
      const validateUserRole = async () => {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
          
          if (error) throw error;
          
          const roleToUse = user.user_metadata?.role || profile?.role;
          const isUserAdmin = roleToUse === 'professor';
          setIsAdmin(isUserAdmin);
          
          if (location.pathname === '/login') {
            navigate(isUserAdmin ? '/admin' : '/dashboard', { replace: true });
          }
        } catch (error) {
          console.error("Role validation error:", error);
          // On role validation error, force logout
          signOut();
        }
      };
      
      setTimeout(() => validateUserRole(), 0);
    }
  }, [user, navigate, location.pathname]);

  // Protect routes
  useEffect(() => {
    if (!isLoading) {
      const protectedRoutes = ['/dashboard', '/admin', '/grades', '/courses', '/leaderboard'];
      const needsAuth = protectedRoutes.includes(location.pathname);
      
      if (needsAuth && !session) {
        console.log("No valid session, redirecting to login");
        navigate('/login', { replace: true });
      }
    }
  }, [session, isLoading, location.pathname, navigate]);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
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
      
      // Clear all auth state
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      
      // Force clear local storage
      localStorage.removeItem('supabase.auth.token');
      
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

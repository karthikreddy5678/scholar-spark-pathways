
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const themes = [
  { id: 'default', name: 'Default', color: 'bg-edu-purple' },
  { id: 'ocean', name: 'Ocean', color: 'bg-blue-500' },
  { id: 'forest', name: 'Forest', color: 'bg-green-500' },
  { id: 'sunset', name: 'Sunset', color: 'bg-orange-500' }
];

export function ThemeCustomizer() {
  const { user } = useAuth();
  const [currentTheme, setCurrentTheme] = useState('default');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from('user_preferences')
        .select('theme')
        .eq('id', user.id)
        .single();
      
      if (data) {
        setCurrentTheme(data.theme);
      }
    };

    loadPreferences();
  }, [user]);

  const updateTheme = async (theme: string) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({ id: user.id, theme }, { onConflict: 'id' });

      if (error) throw error;
      
      setCurrentTheme(theme);
      toast({
        title: "Theme updated",
        description: "Your dashboard theme has been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update theme. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Customize Theme
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {themes.map((theme) => (
            <Button
              key={theme.id}
              variant="outline"
              className={`flex h-20 w-full flex-col items-center justify-center gap-2 ${
                currentTheme === theme.id ? 'ring-2 ring-primary' : ''
              }`}
              disabled={isLoading}
              onClick={() => updateTheme(theme.id)}
            >
              <div className={`h-4 w-4 rounded-full ${theme.color}`} />
              <span className="text-xs">{theme.name}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

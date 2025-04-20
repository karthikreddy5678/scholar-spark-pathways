
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tags } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface HelpRequestFormData {
  title: string;
  description: string;
  tags: string;
}

export function HelpRequestForm() {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset } = useForm<HelpRequestFormData>();

  const onSubmit = async (data: HelpRequestFormData) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const tags = data.tags.split(',').map(tag => tag.trim());
      
      const { error } = await supabase
        .from('help_requests')
        .insert({
          user_id: user.id,
          title: data.title,
          description: data.description,
          tags
        });

      if (error) throw error;
      
      toast({
        title: "Request submitted",
        description: "Your help request has been posted successfully."
      });
      reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit help request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tags className="h-5 w-5" />
          Ask for Help
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              placeholder="Title of your question"
              {...register("title", { required: true })}
            />
          </div>
          <div>
            <Textarea
              placeholder="Describe your question or problem..."
              className="min-h-[100px]"
              {...register("description", { required: true })}
            />
          </div>
          <div>
            <Input
              placeholder="Tags (comma separated, e.g: Math, Algebra, Homework)"
              {...register("tags", { required: true })}
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            Submit Request
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

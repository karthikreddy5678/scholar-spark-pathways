
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Award, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Performance {
  averageGrade: number;
  weakestSubject: string;
  strongestSubject: string;
  recentImprovement: boolean;
}

export function StudyTipsAssistant() {
  const { user } = useAuth();

  const { data: performance, isLoading } = useQuery({
    queryKey: ['student-performance', user?.id],
    queryFn: async (): Promise<Performance> => {
      const { data: grades } = await supabase
        .from('grades')
        .select('grade, courses(title)')
        .eq('student_id', user?.id);

      if (!grades || grades.length === 0) {
        return {
          averageGrade: 0,
          weakestSubject: "N/A",
          strongestSubject: "N/A",
          recentImprovement: false
        };
      }

      const subjectGrades = grades.reduce((acc, grade) => {
        const subject = grade.courses?.title || "Unknown";
        if (!acc[subject]) acc[subject] = [];
        acc[subject].push(grade.grade);
        return acc;
      }, {} as Record<string, number[]>);

      const averageGrade = grades.reduce((sum, grade) => sum + Number(grade.grade), 0) / grades.length;
      
      const subjectAverages = Object.entries(subjectGrades).map(([subject, grades]) => ({
        subject,
        average: grades.reduce((sum, grade) => sum + Number(grade), 0) / grades.length
      }));

      const strongestSubject = subjectAverages.reduce((max, current) => 
        current.average > max.average ? current : max
      ).subject;

      const weakestSubject = subjectAverages.reduce((min, current) => 
        current.average < min.average ? current : min
      ).subject;

      return {
        averageGrade,
        weakestSubject,
        strongestSubject,
        recentImprovement: true // Simplified for demo
      };
    },
    enabled: !!user
  });

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Study Tips Assistant
          </CardTitle>
          <CardDescription>Loading your personalized recommendations...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!performance) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Study Tips Assistant
        </CardTitle>
        <CardDescription>AI-powered learning recommendations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Award className="h-8 w-8 text-edu-purple" />
          <div>
            <h3 className="font-semibold">Performance Overview</h3>
            <p className="text-sm text-muted-foreground">
              Average Grade: {performance.averageGrade.toFixed(2)}
            </p>
          </div>
        </div>

        <Alert className="bg-edu-purple/5 border-edu-purple/20">
          <AlertTitle className="text-edu-purple">Personalized Tips</AlertTitle>
          <AlertDescription className="mt-2 space-y-2">
            <p>
              <span className="font-semibold">💪 Strength:</span> Keep up the great work in {performance.strongestSubject}! 
              Consider helping classmates to reinforce your understanding.
            </p>
            <p>
              <span className="font-semibold">🎯 Focus Area:</span> Dedicate extra time to {performance.weakestSubject}. 
              Try using active recall techniques and spaced repetition.
            </p>
            {performance.recentImprovement && (
              <p>
                <span className="font-semibold">🌟 Progress:</span> Great improvement lately! 
                Maintain your current study routine and stay consistent.
              </p>
            )}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

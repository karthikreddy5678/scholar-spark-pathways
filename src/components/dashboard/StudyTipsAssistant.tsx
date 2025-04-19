
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Star, BookOpen, Brain, Clock, Target } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface StudyTip {
  type: string;
  subject: string;
  tip: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  source?: string;
}

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

  const studyTips: StudyTip[] = [
    {
      type: 'technique',
      subject: 'General',
      tip: 'Try the Pomodoro Technique: 25 minutes of focused study followed by a 5-minute break.',
      duration: 'Ongoing',
      level: 'beginner'
    },
    {
      type: 'suggestion',
      subject: 'Mathematics',
      tip: 'Based on your performance, consider joining a Mathematics study group to collaborate with peers.',
      duration: '2-3 hours weekly',
      level: 'intermediate'
    },
    {
      type: 'resource',
      subject: 'Physics',
      tip: "Check out Khan Academy's free tutorials on Physics for additional practice.",
      duration: 'Self-paced',
      level: 'intermediate',
      source: 'Khan Academy'
    },
    {
      type: 'reminder',
      subject: 'General',
      tip: 'Creating detailed study notes can improve retention by up to 70%.',
      duration: 'Ongoing',
      level: 'intermediate'
    }
  ];

  if (isLoading) {
    return (
      <Card className="animate-pulse bg-card dark:bg-slate-800">
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
    <Card className="bg-card dark:bg-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          ScholarSpark AI
        </CardTitle>
        <CardDescription className="dark:text-slate-400">
          Personalized for {user?.email?.split('@')[0]}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          {studyTips.map((tip, index) => (
            <div 
              key={index}
              className="rounded-lg border p-4 dark:border-slate-700 bg-card dark:bg-slate-800/50"
            >
              <div className="flex items-start gap-3">
                {tip.type === 'technique' && <Brain className="h-5 w-5 text-edu-purple" />}
                {tip.type === 'suggestion' && <Target className="h-5 w-5 text-edu-blue" />}
                {tip.type === 'resource' && <BookOpen className="h-5 w-5 text-edu-green" />}
                {tip.type === 'reminder' && <Clock className="h-5 w-5 text-edu-yellow" />}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium dark:text-white">{tip.subject}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-edu-purple/10 text-edu-purple dark:bg-edu-purple/20">
                      {tip.level}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground dark:text-slate-300">{tip.tip}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground dark:text-slate-400">
                    <span>{tip.duration}</span>
                    {tip.source && (
                      <>
                        <span>•</span>
                        <span>Source: {tip.source}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Alert className="bg-edu-purple/5 border-edu-purple/20 dark:bg-edu-purple/10 dark:border-edu-purple/30">
          <AlertTitle className="text-edu-purple">Performance Overview</AlertTitle>
          <AlertDescription className="mt-2 space-y-2 dark:text-slate-300">
            <p>
              <span className="font-semibold">Average Grade:</span> {performance.averageGrade.toFixed(2)}
            </p>
            <p>
              <span className="font-semibold">💪 Strength:</span> {performance.strongestSubject}
            </p>
            <p>
              <span className="font-semibold">🎯 Focus Area:</span> {performance.weakestSubject}
            </p>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

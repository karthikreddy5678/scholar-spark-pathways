
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpenCheck, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CourseRecommendation {
  id: string;
  title: string;
  description: string;
  relevanceScore: number;
  skillsImproved: string[];
}

interface CourseRecommendationCardProps {
  recommendations: CourseRecommendation[];
  className?: string;
}

export function CourseRecommendationCard({ recommendations, className }: CourseRecommendationCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Course Recommendations</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Info className="h-4 w-4" />
                  <span className="sr-only">Info</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">
                  Recommendations based on your academic performance and interests
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription>Personalized learning opportunities for you</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((recommendation) => (
          <div key={recommendation.id} className="space-y-2 rounded-lg border p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{recommendation.title}</h3>
                <p className="text-sm text-muted-foreground">{recommendation.description}</p>
              </div>
              <BookOpenCheck className="h-5 w-5 text-edu-purple-light" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span>Relevance score</span>
                <span className="font-medium">{recommendation.relevanceScore}%</span>
              </div>
              <Progress value={recommendation.relevanceScore} className="h-2" />
            </div>
            <div className="flex flex-wrap gap-1">
              {recommendation.skillsImproved.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full bg-edu-purple/10 px-2 py-1 text-xs font-medium text-edu-purple"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-edu-purple hover:bg-edu-purple-dark">
          View All Recommendations
        </Button>
      </CardFooter>
    </Card>
  );
}

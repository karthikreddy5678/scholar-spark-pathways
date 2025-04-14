
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Award, Star, TrendingUp, BookOpen, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type AchievementType = "academic" | "improvement" | "participation" | "special";

interface Achievement {
  id: string;
  title: string;
  description: string;
  type: AchievementType;
  date: string;
  icon: keyof typeof iconMap;
  unlocked: boolean;
}

const iconMap = {
  trophy: Trophy,
  award: Award,
  star: Star,
  trending: TrendingUp,
  book: BookOpen,
  zap: Zap,
};

const typeColors = {
  academic: "bg-edu-purple",
  improvement: "bg-edu-green",
  participation: "bg-edu-blue",
  special: "bg-edu-yellow",
};

interface AchievementCardProps {
  achievements: Achievement[];
  className?: string;
}

export function AchievementCard({ achievements, className }: AchievementCardProps) {
  const [selectedType, setSelectedType] = useState<AchievementType | "all">("all");
  
  const filteredAchievements = achievements.filter(
    (achievement) => selectedType === "all" || achievement.type === selectedType
  );

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Achievements & Badges</CardTitle>
        <CardDescription>Your earned accolades and accomplishments</CardDescription>
        <div className="flex flex-wrap gap-2 pt-2">
          <Badge 
            variant={selectedType === "all" ? "default" : "outline"} 
            className="cursor-pointer"
            onClick={() => setSelectedType("all")}
          >
            All
          </Badge>
          <Badge 
            variant={selectedType === "academic" ? "default" : "outline"} 
            className="cursor-pointer"
            onClick={() => setSelectedType("academic")}
          >
            Academic
          </Badge>
          <Badge 
            variant={selectedType === "improvement" ? "default" : "outline"} 
            className="cursor-pointer"
            onClick={() => setSelectedType("improvement")}
          >
            Improvement
          </Badge>
          <Badge 
            variant={selectedType === "participation" ? "default" : "outline"} 
            className="cursor-pointer"
            onClick={() => setSelectedType("participation")}
          >
            Participation
          </Badge>
          <Badge 
            variant={selectedType === "special" ? "default" : "outline"} 
            className="cursor-pointer"
            onClick={() => setSelectedType("special")}
          >
            Special
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAchievements.map((achievement) => {
            const Icon = iconMap[achievement.icon];
            return (
              <div 
                key={achievement.id}
                className={cn(
                  "flex flex-col items-center justify-center rounded-lg p-4 text-center transition-all",
                  achievement.unlocked 
                    ? "bg-background shadow-sm hover:shadow" 
                    : "bg-muted/50 grayscale"
                )}
              >
                <div 
                  className={cn(
                    "mb-2 flex h-12 w-12 items-center justify-center rounded-full text-white",
                    achievement.unlocked ? typeColors[achievement.type] : "bg-muted"
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-medium">{achievement.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{achievement.description}</p>
                {achievement.unlocked && (
                  <p className="mt-2 text-xs font-medium text-edu-purple">
                    Earned on {achievement.date}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Badge variant="outline" className="text-xs">
          {achievements.filter(a => a.unlocked).length}/{achievements.length} Unlocked
        </Badge>
      </CardFooter>
    </Card>
  );
}

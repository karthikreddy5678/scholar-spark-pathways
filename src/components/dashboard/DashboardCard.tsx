
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardCardProps {
  title: string;
  description?: string;
  className?: string;
  icon?: ReactNode;
  children: ReactNode;
}

export function DashboardCard({ title, description, icon, className, children }: DashboardCardProps) {
  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-md", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {icon && <div className="text-edu-purple">{icon}</div>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

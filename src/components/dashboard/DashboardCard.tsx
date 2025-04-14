
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardCardProps {
  title: string;
  description?: string;
  className?: string;
  icon?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
  isActive?: boolean;
  variant?: "default" | "primary" | "secondary" | "outline";
}

export function DashboardCard({ 
  title, 
  description, 
  icon, 
  className, 
  children,
  onClick,
  isActive,
  variant = "default"
}: DashboardCardProps) {
  const variantStyles = {
    default: "",
    primary: "border-edu-purple/30 bg-edu-purple/5",
    secondary: "border-edu-blue/30 bg-edu-blue/5",
    outline: "bg-transparent border-dashed"
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all hover:shadow-md", 
        isActive && "ring-2 ring-edu-purple/50",
        onClick && "cursor-pointer hover:scale-[1.01] transform transition-transform",
        variantStyles[variant],
        className
      )}
      onClick={onClick}
    >
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

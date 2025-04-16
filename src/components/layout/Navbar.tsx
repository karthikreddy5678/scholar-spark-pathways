import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button";
import { LogOut, Menu, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { NotificationPanel } from "@/components/notifications/NotificationPanel";

export function Navbar() {
  const { signOut, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-background border-b border-border h-16 flex items-center justify-between px-6">
      <div className="flex items-center">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="pl-6 pt-6">
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>
                Navigate through the app.
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-2 mt-4">
              <Link to="/dashboard" className="block px-6 py-2 hover:bg-secondary">Dashboard</Link>
              <Link to="/grades" className="block px-6 py-2 hover:bg-secondary">Grades</Link>
              <Link to="/courses" className="block px-6 py-2 hover:bg-secondary">Courses</Link>
              <Link to="/leaderboard" className="block px-6 py-2 hover:bg-secondary">Leaderboard</Link>
            </div>
            <Button
              variant="ghost"
              className="mt-auto mb-4 mx-4 justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={signOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </SheetContent>
        </Sheet>
        <Link to="/dashboard" className="ml-4 text-xl font-bold">
          EduTrack
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <NotificationPanel />
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>{user?.email[0].toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}

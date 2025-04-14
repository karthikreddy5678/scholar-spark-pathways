
import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Menu, Moon, Search, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavbarProps {
  userRole?: "student" | "admin" | "teacher";
  userName?: string;
  userAvatar?: string;
}

export function Navbar({ userRole = "student", userName = "John Doe", userAvatar }: NavbarProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationCount] = useState(3);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <SheetHeader>
                <SheetTitle>
                  <Link to="/" className="flex items-center gap-2">
                    <span className="font-display text-xl font-bold text-edu-purple">ScholarSpark</span>
                  </Link>
                </SheetTitle>
                <SheetDescription>Navigation menu</SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-4 py-6">
                <Link to="/" className="flex items-center gap-2 text-lg font-medium hover:text-edu-purple">
                  Dashboard
                </Link>
                <Link to="/grades" className="flex items-center gap-2 text-lg font-medium hover:text-edu-purple">
                  Grades
                </Link>
                <Link to="/courses" className="flex items-center gap-2 text-lg font-medium hover:text-edu-purple">
                  Courses
                </Link>
                <Link to="/leaderboard" className="flex items-center gap-2 text-lg font-medium hover:text-edu-purple">
                  Leaderboard
                </Link>
                {userRole === "admin" && (
                  <Link to="/admin" className="flex items-center gap-2 text-lg font-medium hover:text-edu-purple">
                    Admin Panel
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          <Link to="/" className="flex items-center gap-2">
            <span className="hidden font-display text-xl font-bold text-edu-purple md:inline-block">
              ScholarSpark
            </span>
          </Link>

          <nav className="hidden md:flex md:items-center md:gap-6">
            <Link to="/" className="text-sm font-medium hover:text-edu-purple">
              Dashboard
            </Link>
            <Link to="/grades" className="text-sm font-medium hover:text-edu-purple">
              Grades
            </Link>
            <Link to="/courses" className="text-sm font-medium hover:text-edu-purple">
              Courses
            </Link>
            <Link to="/leaderboard" className="text-sm font-medium hover:text-edu-purple">
              Leaderboard
            </Link>
            {userRole === "admin" && (
              <Link to="/admin" className="text-sm font-medium hover:text-edu-purple">
                Admin Panel
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-edu-red text-xs text-white">
                  {notificationCount}
                </span>
              )}
            </Button>
          </div>

          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback className="bg-edu-purple text-white">
                    {userName.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/profile" className="flex w-full">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/settings" className="flex w-full">
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

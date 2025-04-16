
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Bell, Menu, LogOut, User, Settings, 
  ChevronDown, BookOpen, Home, GraduationCap, Award
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  userRole: string;
  userName: string;
}

export const Navbar: React.FC<NavbarProps> = ({ userRole, userName }) => {
  const { signOut } = useAuth();
  
  return (
    <div className="bg-background border-b border-border h-16 flex items-center justify-between px-6">
      <div className="flex items-center">
        <button className="md:hidden mr-4">
          <Menu className="h-6 w-6" />
        </button>
        <Link to="/dashboard" className="flex items-center font-semibold">
          <Home className="h-5 w-5 mr-2" />
          ScholarSpark
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span className="text-sm font-medium hidden md:block">{userName}</span>
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to="/dashboard">
                <Home className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/grades">
                <GraduationCap className="mr-2 h-4 w-4" />
                <span>My Grades</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/courses">
                <BookOpen className="mr-2 h-4 w-4" />
                <span>My Courses</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/leaderboard">
                <Award className="mr-2 h-4 w-4" />
                <span>Leaderboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

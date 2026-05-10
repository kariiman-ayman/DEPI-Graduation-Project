import { Badge } from "_core/components/ui/badge";
import { Button } from "_core/components/ui/button";
import { useAuthStore } from "_core/store/authStore";
import {
  BarChart3,
  Bell,
  BookOpen,
  Gauge,
  GraduationCap,
  LayoutGrid,
  LogOut,
  Mail,
  Users,
  UserStar,
} from "lucide-react";
import { Link, Outlet, useLocation } from "react-router";

export default function Layout() {
  const location = useLocation();
  const Logout = useAuthStore((state) => state.logout);

  const menuItems = [
    { path: "/", icon: Gauge, label: "Dashboard" },
    { path: "/students", icon: Users, label: "Students" },
    { path: "/reports", icon: BarChart3, label: "Reports" },
    { path: "/instructors", icon: UserStar, label: "Instructors" },
    { path: "/courses", icon: BookOpen, label: "Courses" },
    { path: "/departments", icon: LayoutGrid, label: "Departments" },
    { path: "/invitations", icon: Mail, label: "Invitations" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg">Smart Campus</h1>
              <p className="text-sm text-gray-500">Admin Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-gray-700 hover:bg-gray-100"
            onClick={Logout}
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl">Administrator Dashboard</h2>
            <p className="text-sm text-gray-500">Welcome back, Admin</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                3
              </Badge>
            </Button>
            <Link
              to="/profile"
              aria-label="Open profile"
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity">
                <span className="text-white">A</span>
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

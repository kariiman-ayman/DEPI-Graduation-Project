import AppLayout from "_core/components/AppLayout";
import {
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  Video,
} from "lucide-react";

const NAV_ITEMS = [
  { path: "/", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/courses", icon: BookOpen, label: "My Courses" },
  { path: "/attendance", icon: ClipboardCheck, label: "Attendance" },
  { path: "/grades", icon: GraduationCap, label: "Grades" },
  { path: "/lectures", icon: Video, label: "Lectures" },
] as const;

export default function Layout() {
  return (
    <AppLayout
      navItems={NAV_ITEMS}
      headerTitle="Instructor Dashboard"
      headerSubtitle="Welcome back"
    />
  );
}

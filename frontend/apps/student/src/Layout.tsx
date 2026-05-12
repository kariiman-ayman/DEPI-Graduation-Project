import AppLayout from "_core/components/AppLayout";
import {
  BookOpen,
  ClipboardCheck,
  CreditCard,
  LayoutDashboard,
  Trophy,
  Video,
} from "lucide-react";

const NAV_ITEMS = [
  { path: "/", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/courses", icon: BookOpen, label: "My Courses" },
  { path: "/attendance", icon: ClipboardCheck, label: "Attendance" },
  { path: "/grades", icon: Trophy, label: "Grades & GPA" },
  { path: "/payments", icon: CreditCard, label: "Payments" },
  { path: "/lectures", icon: Video, label: "Lectures" },
] as const;

export default function Layout() {
  return (
    <AppLayout
      navItems={NAV_ITEMS}
      headerTitle="Student Dashboard"
      headerSubtitle="Welcome back"
    />
  );
}

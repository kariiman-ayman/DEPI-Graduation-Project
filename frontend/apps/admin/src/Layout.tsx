import AppLayout from "_core/components/AppLayout";
import {
  BookOpen,
  CreditCard,
  Gauge,
  LayoutGrid,
  Mail,
  Users,
  UserStar,
} from "lucide-react";

const NAV_ITEMS = [
  { path: "/", icon: Gauge, label: "Dashboard" },
  { path: "/students", icon: Users, label: "Students" },
  { path: "/instructors", icon: UserStar, label: "Instructors" },
  { path: "/courses", icon: BookOpen, label: "Courses" },
  { path: "/departments", icon: LayoutGrid, label: "Departments" },
  { path: "/payments", icon: CreditCard, label: "Payments" },
  { path: "/invitations", icon: Mail, label: "Invitations" },
] as const;

export default function Layout() {
  return (
    <AppLayout
      navItems={NAV_ITEMS}
      headerTitle="Administrator Dashboard"
      headerSubtitle="Welcome back, Admin"
    />
  );
}

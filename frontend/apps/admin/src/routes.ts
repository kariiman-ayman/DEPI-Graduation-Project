import { createBrowserRouter } from "react-router";
import Layout from "./Layout";
import AdminCourseDetail from "./pages/CourseDetail";
import AdminCourses from "./pages/Courses";
import AdminDashboard from "./pages/Dashboard";
import AdminInstructors from "./pages/Instructors";
import AdminLogin from "./pages/Login";
import AdminProfile from "./pages/Profile";
import AdminReports from "./pages/Reports";
import AdminStudents from "./pages/Students";
// import { getSession } from "_core/auth/session";
import { redirect } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: AdminLogin,
  },
  {
    path: "/",
    loader: () => {
      const env = (import.meta as any).env ?? {};
      // Dev default: bypass auth until backend ready.
      // To re-enable auth in dev, set VITE_DISABLE_AUTH=false
      const disableAuth = env.DEV && env.VITE_DISABLE_AUTH !== "false";

      if (disableAuth) return null;
      const session = {
        token: "dev-token",
        user: {
          email: "dev@local",
          role: "admin" as const,
          name: "Dev Admin",
        },
      };
      if (!session) throw redirect("/login");
      return null;
    },
    Component: Layout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "profile", Component: AdminProfile },
      { path: "students", Component: AdminStudents },
      { path: "instructors", Component: AdminInstructors },
      { path: "courses", Component: AdminCourses },
      { path: "courses/:courseId", Component: AdminCourseDetail },
      { path: "reports", Component: AdminReports },
    ],
  },
]);

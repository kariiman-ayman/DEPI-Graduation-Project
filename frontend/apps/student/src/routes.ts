import { createBrowserRouter } from "react-router";
import Layout from "./Layout";
import StudentAttendance from "./pages/Attendance";
import StudentCourses from "./pages/Courses";
import StudentDashboard from "./pages/Dashboard";
import StudentGrades from "./pages/Grades";
import StudentLectures from "./pages/Lectures";
import StudentLogin from "./pages/Login";
import StudentPayments from "./pages/Payments";
import StudentProfile from "./pages/Profile";
import { getSession } from "_core/auth/session";
import { redirect } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: StudentLogin,
  },
  {
    path: "/",
    loader: () => {
      const env = (import.meta as any).env ?? {};
      // Dev default: bypass auth until backend ready.
      // To re-enable auth in dev, set VITE_DISABLE_AUTH=false
      const disableAuth = env.DEV && env.VITE_DISABLE_AUTH !== "false";
      if (disableAuth) return null;
      const session = getSession();
      if (!session) throw redirect("/login");
      return null;
    },
    Component: Layout,
    children: [
      { index: true, Component: StudentDashboard },
      { path: "profile", Component: StudentProfile },
      { path: "courses", Component: StudentCourses },
      { path: "attendance", Component: StudentAttendance },
      { path: "grades", Component: StudentGrades },
      { path: "payments", Component: StudentPayments },
      { path: "lectures", Component: StudentLectures },
    ],
  },
]);

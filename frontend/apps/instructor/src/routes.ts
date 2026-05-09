import { createBrowserRouter } from "react-router";
import Layout from "./Layout";
import InstructorAttendance from "./pages/Attendance";
import InstructorCourseDetail from "./pages/CourseDetail";
import InstructorCourses from "./pages/Courses";
import InstructorDashboard from "./pages/Dashboard";
import InstructorGrades from "./pages/Grades";
import InstructorLectures from "./pages/Lectures";
import InstructorLogin from "./pages/Login";
import InstructorProfile from "./pages/Profile";
import { getSession } from "_core/auth/session";
import { redirect } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: InstructorLogin,
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
      { index: true, Component: InstructorDashboard },
      { path: "profile", Component: InstructorProfile },
      { path: "courses", Component: InstructorCourses },
      { path: "courses/:courseId", Component: InstructorCourseDetail },
      { path: "attendance", Component: InstructorAttendance },
      { path: "grades", Component: InstructorGrades },
      { path: "lectures", Component: InstructorLectures },
    ],
  },
]);

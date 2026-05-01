import { createBrowserRouter } from "react-router";
import Layout from "./Layout";
import AdminCourseDetail from "./pages/CourseDetail";
import AdminCourses from "./pages/Courses";
import AdminDashboard from "./pages/Dashboard";
import AdminInstructors from "./pages/Instructors";
import AdminReports from "./pages/Reports";
import AdminStudents from "./pages/Students";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "students", Component: AdminStudents },
      { path: "instructors", Component: AdminInstructors },
      { path: "courses", Component: AdminCourses },
      { path: "courses/:courseId", Component: AdminCourseDetail },
      { path: "reports", Component: AdminReports },
    ],
  },
]);

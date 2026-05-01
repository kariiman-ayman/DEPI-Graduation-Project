import { createBrowserRouter } from "react-router";
import Layout from "./Layout";
import AdminCourseDetail from "./pages/admin/CourseDetail";
import AdminCourses from "./pages/admin/Courses";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminInstructors from "./pages/admin/Instructors";
import AdminReports from "./pages/admin/Reports";
import AdminStudents from "./pages/admin/Students";

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

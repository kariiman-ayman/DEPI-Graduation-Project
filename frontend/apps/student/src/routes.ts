import { createBrowserRouter } from "react-router";
import Layout from "./Layout";
import StudentAttendance from "./pages/Attendance";
import StudentCourses from "./pages/Courses";
import StudentDashboard from "./pages/Dashboard";
import StudentGrades from "./pages/Grades";
import StudentLectures from "./pages/Lectures";
import StudentPayments from "./pages/Payments";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: StudentDashboard },
      { path: "courses", Component: StudentCourses },
      { path: "attendance", Component: StudentAttendance },
      { path: "grades", Component: StudentGrades },
      { path: "payments", Component: StudentPayments },
      { path: "lectures", Component: StudentLectures },
    ],
  },
]);

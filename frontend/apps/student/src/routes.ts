import { createBrowserRouter } from "react-router";
import Layout from "./Layout";
import StudentAttendance from "./pages/student/Attendance";
import StudentCourses from "./pages/student/Courses";
import StudentDashboard from "./pages/student/Dashboard";
import StudentGrades from "./pages/student/Grades";
import StudentLectures from "./pages/student/Lectures";
import StudentPayments from "./pages/student/Payments";

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

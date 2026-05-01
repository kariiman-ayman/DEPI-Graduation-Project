import { createBrowserRouter } from "react-router";
import Layout from "./Layout";
import InstructorAttendance from "./pages/Attendance";
import InstructorCourseDetail from "./pages/CourseDetail";
import InstructorCourses from "./pages/Courses";
import InstructorDashboard from "./pages/Dashboard";
import InstructorGrades from "./pages/Grades";
import InstructorLectures from "./pages/Lectures";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: InstructorDashboard },
      { path: "courses", Component: InstructorCourses },
      { path: "courses/:courseId", Component: InstructorCourseDetail },
      { path: "attendance", Component: InstructorAttendance },
      { path: "grades", Component: InstructorGrades },
      { path: "lectures", Component: InstructorLectures },
    ],
  },
]);

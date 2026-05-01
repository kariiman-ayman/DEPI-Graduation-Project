import { createBrowserRouter } from "react-router";
import Layout from "./Layout";
import InstructorAttendance from "./pages/instructor/Attendance";
import InstructorCourseDetail from "./pages/instructor/CourseDetail";
import InstructorCourses from "./pages/instructor/Courses";
import InstructorDashboard from "./pages/instructor/Dashboard";
import InstructorGrades from "./pages/instructor/Grades";
import InstructorLectures from "./pages/instructor/Lectures";

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

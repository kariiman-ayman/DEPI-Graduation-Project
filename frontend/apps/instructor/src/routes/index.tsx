import { createBrowserRouter } from "react-router";
import InstructorAttendance from "../pages/Attendance.js";
import InstructorCourseDetail from "../pages/CourseDetail.js";
import InstructorCourses from "../pages/Courses.js";
import InstructorDashboard from "../pages/Dashboard.js";
import InstructorGrades from "../pages/Grades.js";
import InstructorLectures from "../pages/Lectures.js";
import InstructorProfile from "../pages/Profile.js";
import LoginPage from "../pages/Login.js";
import SignUpPage from "../pages/Signup.js";
import { ProtectedRoute, PublicRoute, NotFoundRedirect } from "_core/routes";
import Layout from "../Layout.js";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <SignUpPage />
      </PublicRoute>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        Component: InstructorDashboard,
      },

      {
        path: "profile",
        Component: InstructorProfile,
      },

      {
        path: "courses",
        Component: InstructorCourses,
      },

      {
        path: "courses/:courseId",
        Component: InstructorCourseDetail,
      },

      {
        path: "attendance",
        Component: InstructorAttendance,
      },

      {
        path: "grades",
        Component: InstructorGrades,
      },

      {
        path: "lectures",
        Component: InstructorLectures,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundRedirect />,
  },
]);

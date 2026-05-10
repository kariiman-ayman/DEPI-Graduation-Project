import { createBrowserRouter } from "react-router";
import InstructorAttendance from "../pages/Attendance";
import InstructorCourseDetail from "../pages/CourseDetail";
import InstructorCourses from "../pages/Courses";
import InstructorDashboard from "../pages/Dashboard";
import InstructorGrades from "../pages/Grades";
import InstructorLectures from "../pages/Lectures";
import LoginPage from "../pages/Login";
import SignUpPage from "../pages/Signup";
import { ProtectedRoute, PublicRoute, NotFoundRedirect } from "_core/routes";
import Layout from "../Layout";

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

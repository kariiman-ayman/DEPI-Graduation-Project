import LoginPage from "../pages/Login";
import SignupPage from "../pages/Signup";
import { createBrowserRouter } from "react-router";

import Layout from "../Layout";

import AdminCourseDetail from "../pages/CourseDetail";
import AdminCourses from "../pages/Courses";
import AdminDashboard from "../pages/Dashboard";
import AdminInstructors from "../pages/Instructors";
import AdminProfile from "../pages/Profile";
import AdminReports from "../pages/Reports";
import AdminStudents from "../pages/Students";

import { ProtectedRoute, PublicRoute, NotFoundRedirect } from "_core/routes";
import Invitations from "../pages/Invitations";
import Departments from "../pages/Departments";

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
        <SignupPage />
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
      { index: true, Component: AdminDashboard },
      { path: "profile", Component: AdminProfile },
      { path: "students", Component: AdminStudents },
      { path: "instructors", Component: AdminInstructors },
      { path: "courses", Component: AdminCourses },
      { path: "courses/:courseId", Component: AdminCourseDetail },
      { path: "reports", Component: AdminReports },
      { path: "invitations", Component: Invitations },
      { path: "departments", Component: Departments },
    ],
  },
  {
    path: "*",
    element: <NotFoundRedirect />,
  },
]);

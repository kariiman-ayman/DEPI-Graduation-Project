import LoginPage from "../pages/Login.js";
import SignupPage from "../pages/Signup.js";
import { createBrowserRouter } from "react-router";

import Layout from "../Layout.js";

import AdminCourses from "../pages/Courses.js";
import AdminDashboard from "../pages/Dashboard.js";
import AdminInstructors from "../pages/Instructors.js";
import AdminProfile from "../pages/Profile.js";
import AdminStudents from "../pages/Students.js";

import { ProtectedRoute, PublicRoute, NotFoundRedirect } from "_core/routes";
import Invitations from "../pages/Invitations.js";
import Departments from "../pages/Departments.js";
import AdminPayments from "../pages/Payments.js";

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
      { path: "invitations", Component: Invitations },
      { path: "departments", Component: Departments },
      { path: "payments", Component: AdminPayments },
    ],
  },
  {
    path: "*",
    element: <NotFoundRedirect />,
  },
]);

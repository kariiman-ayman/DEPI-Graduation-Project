import LoginPage from "../pages/Login";
import { createBrowserRouter } from "react-router";

import Layout from "../Layout";

import StudentAttendance from "../pages/Attendance";
import StudentCourses from "../pages/Courses";
import StudentDashboard from "../pages/Dashboard";
import StudentGrades from "../pages/Grades";
import StudentLectures from "../pages/Lectures";
import StudentPayments from "../pages/Payments";
import StudentProfile from "../pages/Profile";

import SignUpPage from "../pages/Signup";

import { ProtectedRoute, PublicRoute, NotFoundRedirect } from "_core/routes";

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
      { index: true, Component: StudentDashboard },
      { path: "profile", Component: StudentProfile },
      { path: "courses", Component: StudentCourses },
      { path: "attendance", Component: StudentAttendance },
      { path: "grades", Component: StudentGrades },
      { path: "payments", Component: StudentPayments },
      { path: "lectures", Component: StudentLectures },
    ],
  },
  {
    path: "*",
    element: <NotFoundRedirect />,
  },
]);

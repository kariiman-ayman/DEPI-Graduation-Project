import LoginPage from "../pages/Login.js";
import { createBrowserRouter } from "react-router";

import Layout from "../Layout.js";

import StudentAttendance from "../pages/Attendance.js";
import StudentCourses from "../pages/Courses.js";
import StudentDashboard from "../pages/Dashboard.js";
import StudentGrades from "../pages/Grades.js";
import StudentLectures from "../pages/Lectures.js";
import StudentPayments from "../pages/Payments.js";
import StudentProfile from "../pages/Profile.js";

import SignUpPage from "../pages/Signup.js";

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

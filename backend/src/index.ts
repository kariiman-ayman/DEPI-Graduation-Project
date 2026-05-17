import "dotenv/config";
// import cors from "cors";
import express from "express";
import serverless from "serverless-http";
// import { adminRoutes, instructorRoutes, studentRoutes } from "./routes";

const app = express();

// const allowedOrigins = [
//   process.env.ADMIN_FRONTEND_URL ?? "http://localhost:5175",
//   process.env.STUDENT_FRONTEND_URL ?? "http://localhost:5173",
//   process.env.INSTRUCTOR_FRONTEND_URL ?? "http://localhost:5174",
// ];

// app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Backend working 🚀",
  });
});

// app.use("/admin", adminRoutes);
// app.use("/student", studentRoutes);
// app.use("/instructor", instructorRoutes);

if (process.env.ENV === "dev") {
  const PORT = 5200;

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
export const handler = serverless(app);

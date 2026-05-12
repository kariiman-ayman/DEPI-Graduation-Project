import "dotenv/config";
import cors from "cors";
import express from "express";
import serverless from "serverless-http";
import { adminRoutes, instructorRoutes, studentRoutes } from "./routes";

const app = express();

const allowedOrigins = [
  "http://localhost:5174",
  "http://localhost:5173",
  "http://localhost:5175",
];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Backend working 🚀",
  });
});

app.use("/admin", adminRoutes);
app.use("/student", studentRoutes);
app.use("/instructor", instructorRoutes);

if (process.env.ENV === "dev") {
  const PORT = 5200;

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
export const handler = serverless(app);

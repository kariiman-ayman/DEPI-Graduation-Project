import express from "express";
import serverless from "serverless-http";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Backend working 🚀",
  });
});

app.get("/health", (req, res) => {
  res.json({
    message: "Backend working ya nogomya 🚀",
  });
});

export default app;
export const handler = serverless(app);

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

app.listen(5000, () => {
  console.log("Server started on port 3000");
});

export default app;
export const handler = serverless(app);

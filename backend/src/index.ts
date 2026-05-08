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

if (process.env.ENV === "dev") {
  const PORT = 5000;

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
export const handler = serverless(app);

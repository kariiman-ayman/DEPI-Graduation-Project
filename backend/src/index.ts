import express from "express";
import type { Request, Response } from "express";
import serverless from "serverless-http";

const app = express();

const PORT = 5000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Hello from Bun + Express + TypeScript",
  });
});

app.get("/bala7", (req: Request, res: Response) => {
  res.json({
    message: "Hello from our bala7 مع تحيات كاري و ضوضو",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Routes: /, /bala7"); // 👈 add this
});

export default serverless(app);

import express from "express";
import type { Request, Response } from "express";
import serverless from "serverless-http";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
const PORT = 5000;

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

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log("Routes: /, /bala7"); // 👈 add this
// });

export default serverless(app);

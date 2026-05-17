import { Router } from "express";
import { verifyUser } from "../../middlewares/auth.middleware";
import {
  getAttendance,
  saveAttendance,
} from "../../controllers/instructor/attendance.controller";

const router = Router();

router.use(verifyUser);
router.get("/", getAttendance);
router.post("/", saveAttendance);

export default router;

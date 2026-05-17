import { Router } from "express";
import { verifyUser } from "../../middlewares/auth.middleware.js";
import {
  getAttendance,
  saveAttendance,
} from "../../controllers/instructor/attendance.controller.js";

const router = Router();

router.use(verifyUser);
router.get("/", getAttendance);
router.post("/", saveAttendance);

export default router;

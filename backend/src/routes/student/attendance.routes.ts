import { Router } from "express";
import { verifyUser } from "../../middlewares/auth.middleware.js";
import { getMyAttendance } from "../../controllers/student/attendance.controller.js";

const router = Router();

router.use(verifyUser);
router.get("/", getMyAttendance);

export default router;

import { Router } from "express";
import { verifyUser } from "../../middlewares/auth.middleware";
import { getMyAttendance } from "../../controllers/student/attendance.controller";

const router = Router();

router.use(verifyUser);
router.get("/", getMyAttendance);

export default router;

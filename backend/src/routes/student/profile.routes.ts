import { Router } from "express";
import { verifyUser } from "@/middlewares/auth.middleware";
import { getProfile, updateProfile, changePassword } from "@/controllers/student/profile.controller";

const router = Router();

router.use(verifyUser);
router.get("/", getProfile);
router.patch("/", updateProfile);
router.post("/change-password", changePassword);

export default router;

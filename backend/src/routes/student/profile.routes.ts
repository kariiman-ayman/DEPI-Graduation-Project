import { Router } from "express";
import { verifyUser } from "../../middlewares/auth.middleware.js";
import {
  getProfile,
  updateProfile,
  changePassword,
} from "../../controllers/student/profile.controller.js";

const router = Router();

router.use(verifyUser);
router.get("/", getProfile);
router.patch("/", updateProfile);
router.post("/change-password", changePassword);

export default router;

import express from "express";
import {
  loginController,
  signupController,
  validateInviteController,
} from "@/controllers/student/auth.controller";

const router = express.Router();

router.get("/validate-invite", validateInviteController);
router.post("/signup", signupController);
router.post("/login", loginController);

export default router;

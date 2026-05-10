import { Router } from "express";
import { verifyUser } from "@/middlewares/auth.middleware";
import {
  getInvitations,
  inviteUser,
} from "@/controllers/admin/invite.controller";

const router = Router();

router.post("/", verifyUser, inviteUser);
router.get("/list", verifyUser, getInvitations);

export default router;

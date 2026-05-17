import { Router } from "express";
import { verifyUser } from "../../middlewares/auth.middleware.js";
import {
  getInvitations,
  inviteUser,
  resendInvite,
  revokeInvite,
} from "../../controllers/admin/invite.controller.js";

const router = Router();

router.post("/", verifyUser, inviteUser);
router.get("/list", verifyUser, getInvitations);
router.post("/:token/resend", verifyUser, resendInvite);
router.delete("/:token", verifyUser, revokeInvite);

export default router;

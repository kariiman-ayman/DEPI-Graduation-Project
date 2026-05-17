import { Router } from "express";
import { verifyUser } from "../../middlewares/auth.middleware.js";
import { getAllPayments } from "../../controllers/admin/payment.controller.js";

const router = Router();

router.get("/", verifyUser, getAllPayments);

export default router;

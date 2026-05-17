import { Router } from "express";
import { verifyUser } from "../../middlewares/auth.middleware";
import { getAllPayments } from "../../controllers/admin/payment.controller";

const router = Router();

router.get("/", verifyUser, getAllPayments);

export default router;

import { Router } from "express";
import { verifyUser } from "@/middlewares/auth.middleware";
import { getMyPayments, payInstallment } from "@/controllers/student/payment.controller";

const router = Router();

router.use(verifyUser);
router.get("/", getMyPayments);
router.post("/:paymentId/pay", payInstallment);

export default router;

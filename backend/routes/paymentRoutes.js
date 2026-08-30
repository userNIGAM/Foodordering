import { Router } from "express";
import {
  initiatePayment,
  verifyPayment,
  paymentFailed,
} from "../controllers/paymentController.js";

const router = Router();

router.post("/initiate", initiatePayment);
router.post("/verify", verifyPayment);
router.post("/failed", paymentFailed);

export default router;

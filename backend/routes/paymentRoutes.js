import { Router } from "express"

const router = Router()

import {

  initiatePayment,
  verifyPayment,
  paymentFailed

} from "../controllers/paymentController.js"



router.post("/initiate", initiatePayment)

router.post("/verify", verifyPayment)

router.post("/failed", paymentFailed)



export default router
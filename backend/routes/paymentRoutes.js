import { Router } from "express"
const router = Router()

import {initiatePayment} from "../controllers/paymentController.js"

router.post("/initiate", initiatePayment)

export default router
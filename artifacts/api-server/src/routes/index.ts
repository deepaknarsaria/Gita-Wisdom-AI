import { Router, type IRouter } from "express";
import healthRouter from "./health";
import openaiRouter from "./openai/conversations";
import razorpayRouter from "./razorpay";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/openai", openaiRouter);
router.use("/razorpay", razorpayRouter);

export default router;

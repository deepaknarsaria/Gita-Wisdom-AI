import { Router, type IRouter } from "express";
import { createHmac } from "crypto";

const router: IRouter = Router();

router.post("/verify-payment", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const secret = process.env.RAZORPAY_SECRET;
  if (!secret) {
    return res.status(500).json({ success: false, message: "Server misconfiguration" });
  }

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ success: false, message: "Missing payment fields" });
  }

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    return res.json({ success: true, payment_id: razorpay_payment_id });
  } else {
    return res.status(400).json({ success: false, message: "Invalid signature" });
  }
});

export default router;

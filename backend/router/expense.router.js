import { Router } from "express";
import { verifyUser } from "../middleware/auth_middleware.js";
import { addexpenseItem, createExpense, settlePayment } from "../controller/expencess.controller.js";

const router = Router();
router.use(verifyUser);
router.post("/create-expense", createExpense);
router.post("/add-expense-items", addexpenseItem);
router.post("/settle-payment", settlePayment);
export default router;
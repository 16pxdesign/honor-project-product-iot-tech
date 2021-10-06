import {Router} from "express";
import * as CheckoutController from "../controllers/OrderController";
import {auth} from "../middleware/auth";

const router = Router();


router.get('/transactions/all', auth, CheckoutController.transactionsAll);
router.get('/transactions', auth, CheckoutController.transactions);
router.get('/id/:id', auth, CheckoutController.transactionByID);

export default router;
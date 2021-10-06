import {Router} from "express";
import {auth} from "../middleware/auth";
import {checkout} from "../controllers/CheckoutController";

const router = Router();

router.post('/', auth, checkout);

export default router;
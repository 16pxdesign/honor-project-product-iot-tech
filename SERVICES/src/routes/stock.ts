import {NextFunction, Request, Response, Router} from "express";
import passport from "passport";
import * as StockController from "../controllers/StockController";
import * as index from "../controllers";
import {auth} from "../middleware/auth";

const router = Router();

router.get('/all', auth, StockController.stockAll);
router.post('/add', auth, StockController.add);
router.get('/id/:id', auth, StockController.stockByID);


export default router;
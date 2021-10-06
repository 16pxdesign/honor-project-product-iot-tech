import {Router} from "express";
import * as InfoController from "../controllers/InfoController";
import {auth} from "../middleware/auth";

const router = Router();

router.post('/delete', auth, InfoController.DeleteProductInfoById);
router.post('/add', auth, InfoController.add);
router.get('/list', auth, InfoController.ProductInfoList);
router.get('/:id', auth, InfoController.ProductInfoById);


export default router;
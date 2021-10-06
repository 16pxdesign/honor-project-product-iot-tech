import {Router} from "express";
import * as InventoryController from "../controllers/InventoryController";
import {auth} from "../middleware/auth";

const router = Router();

router.get('/find/:id', auth, InventoryController.find);
router.get('/:time', auth, InventoryController.inventoryList);


export default router;
import {NextFunction, Request, Response, Router} from "express";
import passport from "passport";
import * as PresenceController from "../controllers/PresenceController";
import * as index from "../controllers";
import {auth} from "../middleware/auth";

const router = Router();


router.get('/', auth, PresenceController.listAllReaders);
router.post('/state', auth, PresenceController.changeState);
router.get('/active', auth, PresenceController.listActiveReaders);

export default router;
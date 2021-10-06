import {Router} from "express";
import * as UserController from "../controllers/UserController";
import {auth} from "../middleware/auth";

const router = Router();


router.get('/', (req, res) => {
    res.send(req.user);
});
router.post('/login', UserController.login);
router.post('/register', UserController.register);
router.get('/logout', auth, UserController.logout);
router.get('/list', auth, UserController.getUsers);
router.post('/delete', auth, UserController.deleteUser);


export default router;
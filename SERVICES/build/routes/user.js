"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController = __importStar(require("../controllers/UserController"));
const auth_1 = require("../middleware/auth");
const router = express_1.Router();
router.get('/', (req, res) => { res.send(req.user); });
router.post('/login', UserController.login);
router.post('/register', UserController.register);
router.get('/logout', auth_1.auth, UserController.logout);
router.get('/list', auth_1.auth, UserController.getUsers);
router.post('/delete', auth_1.auth, UserController.deleteUser);
exports.default = router;

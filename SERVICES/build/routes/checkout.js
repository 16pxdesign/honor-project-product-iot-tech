"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const CheckoutController_1 = require("../controllers/CheckoutController");
const router = express_1.Router();
router.post('/', auth_1.auth, CheckoutController_1.checkout);
exports.default = router;

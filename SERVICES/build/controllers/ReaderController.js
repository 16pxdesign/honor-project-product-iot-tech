"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = void 0;
function logout(req, res, next) {
    req.logout();
    res.send("success");
}
exports.logout = logout;

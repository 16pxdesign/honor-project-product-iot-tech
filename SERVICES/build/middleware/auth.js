"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
function auth(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(403);
    res.send('No access');
}
exports.auth = auth;

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
exports.UserView = exports.Role = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const UserSchema = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    email: String,
    password: String,
    role: { type: Number,
        enum: [0, 1, 2],
        default: 0 },
});
var Role;
(function (Role) {
    Role[Role["Home"] = 0] = "Home";
    Role[Role["Company"] = 1] = "Company";
    Role[Role["Admin"] = 2] = "Admin";
})(Role = exports.Role || (exports.Role = {}));
exports.default = mongoose_1.default.model('users', UserSchema, 'users');
exports.UserView = mongoose_1.default.model('userview', UserSchema, 'users');

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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = exports.deleteUser = exports.getUsers = exports.login = exports.register = exports.logout = void 0;
const User_1 = __importStar(require("../models/User"));
const passport_1 = __importDefault(require("passport"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const UserService_1 = require("../events/services/UserService");
const config_1 = require("../config/config");
const EventStore_1 = require("../events/stores/EventStore");
function logout(req, res, next) {
    req.logout();
    res.send("success");
}
exports.logout = logout;
function register(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const doesUserExit = yield User_1.default.exists({ email: req.body.email });
        if (doesUserExit) {
            return res.send("Registration fail");
        }
        if (!req.body.role) { //temporary
            req.body.role = 0;
        }
        const hashPassword = yield bcryptjs_1.default.hash(req.body.password, 10);
        const c = {
            email: req.body.email, password: hashPassword, role: req.body.role
        };
        const user = yield new UserService_1.UserService(new EventStore_1.EventStore(config_1.KAFKA)).createUser(c);
        return res.send("success");
    });
}
exports.register = register;
function login(req, res, next) {
    passport_1.default.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err); // will generate a 500 error
        }
        if (!user) {
            return res.send({ success: false, message: 'Authentication failed', info: info });
        }
        req.login(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.send("success");
        });
    })(req, res, next);
}
exports.login = login;
function getUsers(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const documents = yield User_1.default.find({}, { _id: 1, email: 1, role: 1 }).exec();
        console.log(JSON.stringify(documents));
        return res.send(documents);
    });
}
exports.getUsers = getUsers;
function deleteUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.body.id)
            return res.send('Request fail - no id');
        const id = req.body.id;
        const isExist = yield User_1.default.exists({ _id: id });
        if (!isExist)
            return res.send('Request fail - not exist');
        const c = {
            id: id
        };
        new UserService_1.UserService(new EventStore_1.EventStore(config_1.KAFKA)).deleteUser(c).then(() => {
            return res.send('success');
        }).catch(() => {
            return res.send('Request fail - Service err');
        });
    });
}
exports.deleteUser = deleteUser;
/**
 * debug
 * @param req
 * @param res
 * @param next
 */
function getAll(req, res, next) {
    User_1.default.find({}).exec().then((query) => {
        console.log(query[0].role == User_1.Role.Home);
    });
    return res.send('ok');
}
exports.getAll = getAll;

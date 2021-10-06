"use strict";
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
exports.socketAuth = void 0;
const passport_socketio_1 = __importDefault(require("passport.socketio"));
function socketAuth(store) {
    return (socket, next) => __awaiter(this, void 0, void 0, function* () {
        return passport_socketio_1.default.authorize({
            // cookieParser: cookieParser(),       // the same middleware you registrer in express
            key: 'connect.sid',
            secret: 'secret',
            store: store,
            success: onAuthorizeSuccess,
            fail: onAuthorizeFail, // *optional* callback on fail/error - read more below
        })(socket, next);
    });
}
exports.socketAuth = socketAuth;
function onAuthorizeSuccess(data, accept) {
    console.log('Successful connection to socket.io by: ', data.user._id);
    accept();
}
function onAuthorizeFail(data, message, error, accept) {
    if (error)
        throw new Error(message);
    console.log('Failed connection to socket.io :', message);
}

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
exports.UserDeleteHandler = void 0;
const build_1 = require("../../../../escore/build");
const User_1 = __importDefault(require("../../models/User"));
const uuid = require("node-uuid");
class UserDeleteHandler {
    execute(command) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne({ _id: command.id }).select('-password');
            if (!user)
                throw new Error('User not exist');
            const event = {
                id: user._id,
                date: new Date(),
                email: user.email,
                role: user.role,
                type: build_1.EventType.USER_DELETED,
                transaction: uuid.v4()
            };
            return event;
        });
    }
}
exports.UserDeleteHandler = UserDeleteHandler;

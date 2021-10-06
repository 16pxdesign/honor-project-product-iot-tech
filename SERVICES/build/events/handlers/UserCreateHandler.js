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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCreateHandler = void 0;
const build_1 = require("../../../../escore/build");
const uuid = require("node-uuid");
const bson = require('bson');
class UserCreateHandler {
    execute(command) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = {
                id: new bson.ObjectId(),
                date: new Date(),
                email: command.email,
                password: command.password,
                role: command.role,
                type: build_1.EventType.USER_CREATED,
                transaction: uuid.v4()
            };
            return event;
        });
    }
}
exports.UserCreateHandler = UserCreateHandler;

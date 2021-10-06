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
exports.UserService = void 0;
const build_1 = require("../../../../escore/build");
const UserCreateHandler_1 = require("../handlers/UserCreateHandler");
const UserCreateProjector_1 = require("../projectors/UserCreateProjector");
const UserDeleteHandler_1 = require("../handlers/UserDeleteHandler");
const UserDeleteProjector_1 = require("../projectors/UserDeleteProjector");
class UserService extends build_1.BaseCommandService {
    constructor(store) {
        super(store);
    }
    createUser(c) {
        return __awaiter(this, void 0, void 0, function* () {
            this.commandHandler = new UserCreateHandler_1.UserCreateHandler();
            this.projector = new UserCreateProjector_1.UserCreateProjector();
            return this.execute(c);
        });
    }
    deleteUser(c) {
        return __awaiter(this, void 0, void 0, function* () {
            this.commandHandler = new UserDeleteHandler_1.UserDeleteHandler();
            this.projector = new UserDeleteProjector_1.UserDeleteProjector();
            return this.execute(c);
        });
    }
}
exports.UserService = UserService;

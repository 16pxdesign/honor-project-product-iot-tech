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
exports.UserCreateProjector = void 0;
const User_1 = __importDefault(require("../../models/User"));
class UserCreateProjector {
    getCurrentState(_) {
        return __awaiter(this, void 0, void 0, function* () {
            const state = { email: "", password: "", role: 0 };
            return state;
        });
    }
    project(currentState, event) {
        return __awaiter(this, void 0, void 0, function* () {
            const e = event;
            currentState._id = e.id;
            currentState.email = e.email;
            currentState.password = e.password;
            currentState.role = e.role;
            return currentState;
        });
    }
    updateState(state) {
        return __awaiter(this, void 0, void 0, function* () {
            return new User_1.default(state).save();
        });
    }
}
exports.UserCreateProjector = UserCreateProjector;

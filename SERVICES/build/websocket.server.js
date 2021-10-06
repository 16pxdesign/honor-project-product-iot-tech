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
const WebSocketContoller_1 = require("./controllers/WebSocketContoller");
const socket_io_1 = require("socket.io");
const express_socket_io_session_1 = __importDefault(require("express-socket.io-session"));
const socketauth_1 = require("./middleware/socketauth");
const server_1 = require("./server");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const emitter = new WebSocketContoller_1.Emitter(server_1.kafka);
    yield emitter.init();
    const io = new socket_io_1.Server(server_1.server, { cors: { origin: server_1.origins, credentials: true }, });
    io.use(express_socket_io_session_1.default(server_1.session_var));
    io.use(socketauth_1.socketAuth(server_1.mongoDBStore));
    io.on('connect', (socket) => {
        WebSocketContoller_1.socketHandler(socket, emitter);
    });
}))();

import config from "./config/config";
import {Emitter, socketHandler} from "./controllers/WebSocketContoller";
import {Server} from "socket.io";
import sharedSession from "express-socket.io-session";
import {socketAuth} from "./middleware/socketauth";
import {kafka, mongoDBStore, origins, server, session_var} from "./server";

/**
 * Entry point for checkout websocket service
 */
(async () => {
        const emitter = new Emitter(kafka);
        await emitter.init();
        const io = new Server(server,{ cors: { origin: origins,credentials: true }, });

        io.use(sharedSession(session_var))

        io.use(socketAuth(mongoDBStore))

        io.on('connect', (socket) => {
            socketHandler(socket, emitter);
        });
    })()

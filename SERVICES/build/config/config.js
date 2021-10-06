"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KAFKA = exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const kafkajs_1 = require("kafkajs");
dotenv_1.default.config();
const MONGO_STRING = process.env.MONGOOSE_HOST || '';
const MONGO_OPTIONS = { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true };
const MONGO = { hostname: MONGO_STRING, options: MONGO_OPTIONS };
const SERVER_HOST = process.env.SERVER_HOST || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT || 3000;
const SERVER = { hostname: SERVER_HOST, port: SERVER_PORT };
const WEBSOCKET = process.env.WEBSOCKET == "true";
const PRESENCE = process.env.PRESENCE == "true";
const CLIENT_ID = process.env.CLIENT_ID || 'web-1';
const KAFKA_HOST = process.env.KAFKA_HOST || "localhost:9093";
exports.config = {
    server: SERVER,
    mongo: MONGO,
    websocket: WEBSOCKET,
    presence: PRESENCE,
    clientID: CLIENT_ID,
    kafka_host: KAFKA_HOST,
};
exports.KAFKA = new kafkajs_1.Kafka({ clientId: CLIENT_ID, brokers: [KAFKA_HOST], retry: { retries: 100 } });
exports.default = exports.config;

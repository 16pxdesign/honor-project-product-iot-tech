import dotenv from 'dotenv';
import {Kafka} from "kafkajs";

dotenv.config();

const MONGO_STRING = process.env.MONGOOSE_HOST || '';
const MONGO_OPTIONS = {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true};
const MONGO = {hostname: MONGO_STRING, options: MONGO_OPTIONS};

const SERVER_HOST = process.env.SERVER_HOST || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT || 3000;

const SERVER = {hostname: SERVER_HOST, port: SERVER_PORT};
const WEBSOCKET :boolean = process.env.WEBSOCKET == "true";
const PRESENCE :boolean = process.env.PRESENCE == "true";

const CLIENT_ID = process.env.CLIENT_ID || 'web-1';
const KAFKA_HOST = process.env.KAFKA_HOST || "localhost:9093";

export const config = {
    server: SERVER,
    mongo: MONGO,
    websocket: WEBSOCKET,
    presence: PRESENCE,
    clientID: CLIENT_ID,
    kafka_host: KAFKA_HOST,
};

export const KAFKA = new Kafka({clientId: CLIENT_ID, brokers: [KAFKA_HOST], retry: {retries: 100}});

export default config;
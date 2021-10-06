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
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
// List your collection names here
const COLLECTIONS = [];
class DBManager {
    constructor() {
        this.db = null;
        this.server = new MongoMemoryServer();
        this.connection = null;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = yield this.server.getUri();
            this.connection = yield MongoClient.connect(url, { useNewUrlParser: true });
            this.db = this.connection.db(yield this.server.getDbName());
        });
    }
    stop() {
        this.connection.disconnect();
        return this.server.stop();
    }
    cleanup() {
        return Promise.all(COLLECTIONS.map((c) => this.db.collection(c).remove({})));
    }
}
exports.default = DBManager;

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
exports.ReaderStartScanHandler = void 0;
const build_1 = require("../../../../escore/build");
require('dotenv').config();
class ReaderStartScanHandler {
    execute(command) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = {
                client: command.client,
                reader_id: command.reader_id,
                transaction: command.transaction,
                date: new Date(),
                type: build_1.EventType.READER_REQUESTED_START,
                timeout: command.timeout
            };
            return event;
        });
    }
}
exports.ReaderStartScanHandler = ReaderStartScanHandler;

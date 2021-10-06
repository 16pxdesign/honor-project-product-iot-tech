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
exports.ReaderService = void 0;
const build_1 = require("../../../../escore/build");
const ReaderStartScanHandler_1 = require("../handlers/ReaderStartScanHandler");
const ReaderStopScanHandler_1 = require("../handlers/ReaderStopScanHandler");
const ReaderPresentedHandler_1 = require("../handlers/ReaderPresentedHandler");
class ReaderService extends build_1.BaseCommandService {
    constructor(store) {
        super(store);
    }
    start(c) {
        return __awaiter(this, void 0, void 0, function* () {
            this.commandHandler = new ReaderStartScanHandler_1.ReaderStartScanHandler();
            return this.execute(c);
        });
    }
    stop(c) {
        return __awaiter(this, void 0, void 0, function* () {
            this.commandHandler = new ReaderStopScanHandler_1.ReaderStopScanHandler();
            return this.execute(c);
        });
    }
    present(c) {
        return __awaiter(this, void 0, void 0, function* () {
            this.commandHandler = new ReaderPresentedHandler_1.ReaderPresentedHandler();
            return this.execute(c);
        });
    }
}
exports.ReaderService = ReaderService;

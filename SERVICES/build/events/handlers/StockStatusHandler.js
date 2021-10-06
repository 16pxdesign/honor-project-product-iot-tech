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
exports.StockStatusHandler = void 0;
const build_1 = require("../../../../escore/build");
require('dotenv').config();
class StockStatusHandler {
    execute(command) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = {
                products: command.products,
                approved: command.reason.length > 0 ? false : true,
                date: new Date(),
                reason: command.reason,
                transaction: command.transaction,
                type: command.reason.length > 0 ? build_1.EventType.ORDER_REJECTED : build_1.EventType.ORDER_APPROVED
            };
            return event;
        });
    }
}
exports.StockStatusHandler = StockStatusHandler;

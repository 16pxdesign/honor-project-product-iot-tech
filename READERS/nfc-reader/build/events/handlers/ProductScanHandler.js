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
exports.ProductScanHandler = void 0;
const build_1 = require("../../../../escore/build");
require('dotenv').config();
class ProductScanHandler {
    execute(command) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = "", rssi = "", tx = "";
            const event = {
                client: command.client,
                product_id: command.data.id,
                product_extra: command.data.blocks,
                product_rssi: rssi,
                product_tx: tx,
                reader_id: process.env.ID || "",
                reader_type: process.env.TYPE || "",
                transaction: command.transaction,
                date: new Date(),
                type: build_1.EventType.PRODUCT_SCANNED
            };
            return event;
        });
    }
    parse(data, set) {
        if (data[0] === 0) {
            return undefined;
        }
        else {
            //console.log(data.toString('hex'))
            if (data[0] === 0x43 && data[1] === 0x54 && data[5] === 0x45) {
                const id = data.slice(18, 30);
                const rssi = data.slice(30, 31);
                // console.log('id? %s', id.toString('hex'))
                //console.log('rssi? %s', rssi.toString('hex'))
                return Array(id, rssi);
            }
            else {
                return undefined;
            }
        }
    }
}
exports.ProductScanHandler = ProductScanHandler;

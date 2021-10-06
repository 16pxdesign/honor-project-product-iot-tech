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
            let result = this.parse(command.data);
            if (!result)
                return Promise.reject('No data fit');
            console.log('Data fit');
            id = result[0].toString('hex');
            rssi = result[1].toString('hex');
            const event = {
                client: command.client,
                product_id: id,
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
        console.log('data in parse ', data.toString('hex'));
        if (data[0] === 0) {
            return undefined;
        }
        else {
            //console.log(data.toString('hex'))
            if (data[0 + 1] === 0x43 && data[1 + 1] === 0x54 && data[5 + 1] === 0x45) {
                console.log(true);
                const id = data.slice(18 + 1, 30 + 1);
                const rssi = data.slice(30 + 1, 31 + 1);
                const id2 = data.slice(35, 47);
                if (id.toString('hex') !== id2.toString('hex'))
                    return undefined;
                console.log('id? %s', id.toString('hex'));
                console.log('id?2 %s', id2.toString('hex'));
                console.log('rssi? %s', rssi.toString('hex'));
                return Array(id, rssi);
            }
            else {
                return undefined;
            }
        }
    }
}
exports.ProductScanHandler = ProductScanHandler;

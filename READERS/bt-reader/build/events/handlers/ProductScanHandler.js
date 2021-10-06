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
            //console.log(command.data)
            let m = command.data.advertisement.manufacturerData;
            if (!m)
                return Promise.reject('No data fit');
            console.log('Data fit');
            if (m.length > 24)
                id = m.slice(0, 24).toString('hex');
            else
                id = m.toString('hex');
            if (command.data.rssi)
                rssi = command.data.rssi.toString();
            if (m.length > 24)
                tx = m.slice(24, 25).readInt8(0).toString();
            //TODO BEACON CHECK
            const event = {
                device_mac: command.data.address, device_name: command.data.advertisement.localName,
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
}
exports.ProductScanHandler = ProductScanHandler;

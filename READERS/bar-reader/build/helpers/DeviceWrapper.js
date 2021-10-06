"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const serialport_1 = __importDefault(require("serialport"));
exports.default = new serialport_1.default('/dev/ttyACM0', {
    baudRate: 115200,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    autoOpen: false
}, () => {
});

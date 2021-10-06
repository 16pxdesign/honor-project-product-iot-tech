"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_hid_1 = __importDefault(require("node-hid"));
try {
    var device = new node_hid_1.default.HID(10473, 643);
    var devices = node_hid_1.default.devices();
    console.log('devices:', node_hid_1.default.devices());
    device.on('data', function (data) {
        if (data[0] === 0) {
        }
        else {
            //proccess data
            console.log(data);
        }
    });
}
catch (e) {
    console.log('catch');
    console.log(e);
}

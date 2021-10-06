"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dev = void 0;
var HID = require('node-hid');
var devices = HID.devices();
exports.dev = new HID.HID(6790, 57360);
class HIDES extends HID.HID {
    constructor(vid, pid) {
        super(vid, pid);
        this.path = 'hid/device';
    }
    static open(callback) {
        try {
            return new this(6790, 57360);
        }
        catch (e) {
            callback(e);
        }
        return undefined;
    }
}
exports.default = HIDES;

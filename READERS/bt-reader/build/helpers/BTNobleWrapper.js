"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const noble_1 = __importDefault(require("@abandonware/noble"));
/** wrapper for Noble to add needed functions */
let path = 'bt/device'; //dump device path //TODO: put to env
const myModule = {
    foo: function () { },
    path,
};
exports.default = Object.assign(noble_1.default, myModule);

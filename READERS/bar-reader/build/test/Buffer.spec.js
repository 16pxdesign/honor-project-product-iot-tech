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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_hid_1 = __importDefault(require("node-hid"));
describe('test123', () => {
    it('buffer', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            var device = new node_hid_1.default.HID(10473, 643);
            device.on('data', function (data) {
                /*   if(data[0] === 0){
   
                   }
                   else {
                       //proccess data
                       console.log(data);
                   }
   
   */
                console.log(data);
            });
        }
        catch (e) {
            console.log('catch');
            console.log(e);
        }
    }));
});

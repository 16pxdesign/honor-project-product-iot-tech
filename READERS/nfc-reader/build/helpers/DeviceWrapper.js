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
const events_1 = __importDefault(require("events"));
const Mfrc522 = require("mfrc522-rpi");
const SoftSPI = require("rpi-softspi");
class Device extends events_1.default {
    constructor() {
        super();
        this.path = 'nfc/device'; //dump device path
        this.spi = new SoftSPI({ clock: 23, mosi: 19, miso: 21, client: 24 });
        this.dv = new Mfrc522(this.spi).setResetPin(22).setBuzzerPin(18);
        this.interval = undefined;
    }
    toHex(d) {
        return ("0" + (Number(d).toString(16))).slice(-2).toUpperCase();
    }
    open(err) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.interval)
                clearInterval(this.interval);
            this.interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                this.dv.reset();
                let data = {};
                //# Scan for cards
                let response = this.dv.findCard();
                if (!response.status) {
                    //console.log("No Card");
                    return;
                }
                //console.log("Card detected, CardType: " + response.bitSize);
                //# Get the UID of the card
                response = this.dv.getUid();
                if (!response.status) {
                    //console.log("UID Scan Error");
                    return;
                }
                //# If we have the UID, continue
                const uid = response.data;
                data.id = this.toHex(uid[0]);
                data.id = data.id.concat(this.toHex(uid[1]));
                data.id = data.id.concat(this.toHex(uid[2]));
                data.id = data.id.concat(this.toHex(uid[3]));
                //# Select the scanned card
                const memoryCapacity = this.dv.selectCard(uid);
                //# This is the default key for authentication
                const key = [0xff, 0xff, 0xff, 0xff, 0xff, 0xff];
                var sec = "";
                var secarr = [];
                for (let i = 8; i < 64; i++) {
                    if ((i + 1) % 4 == 0) {
                        //console.log("SEC ", (i - 7 - 4) / 4, sec);
                        secarr.push(sec);
                        sec = "";
                    }
                    else {
                        if (yield this.dv.authenticate(i, key, uid)) {
                            //console.log("Block: " + i + " Data: " + this.dv.getDataForBlock(i).toString('hex'));
                            for (let bit of this.dv.getDataForBlock(i)) {
                                sec = sec.concat(this.toHex(bit));
                            }
                        }
                        else {
                            console.log("Authentication Error");
                            break;
                        }
                    }
                }
                if (secarr.length == 14)
                    data.blocks = secarr;
                this.emit('data', data);
                this.dv.stopCrypto();
            }), 500);
        });
    }
}
exports.default = Device;

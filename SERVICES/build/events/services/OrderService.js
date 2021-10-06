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
exports.OrderService = void 0;
const build_1 = require("../../../../escore/build");
const OrderPlaceHandler_1 = require("../handlers/OrderPlaceHandler");
const OrderPlaceProjector_1 = require("../projectors/OrderPlaceProjector");
class OrderService extends build_1.BaseCommandService {
    constructor(store) {
        super(store);
    }
    checkout(c) {
        return __awaiter(this, void 0, void 0, function* () {
            this.commandHandler = new OrderPlaceHandler_1.OrderPlaceHandler();
            this.projector = new OrderPlaceProjector_1.OrderPlaceProjector();
            return this.execute(c);
        });
    }
}
exports.OrderService = OrderService;
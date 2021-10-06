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
exports.StockStatusProjector = void 0;
const Stock_1 = require("../../models/Stock");
class StockStatusProjector {
    getCurrentState(event) {
        return __awaiter(this, void 0, void 0, function* () {
            let state = { product_ids: [] };
            if (event.approved) {
                state.product_ids = event.products;
            }
            return state;
        });
    }
    project(currentState, event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (event.approved) {
                console.log('currentState.product_ids', currentState.product_ids);
                for (const product of currentState.product_ids) {
                    const iStockDocuments = yield Stock_1.Stock.findOneAndDelete({ product_id: product }).exec();
                }
                return { product_ids: [] };
            }
            return currentState;
        });
    }
    updateState(state) {
        return __awaiter(this, void 0, void 0, function* () {
            return state;
        });
    }
}
exports.StockStatusProjector = StockStatusProjector;

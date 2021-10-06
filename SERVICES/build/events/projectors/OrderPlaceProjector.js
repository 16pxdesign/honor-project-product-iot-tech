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
exports.OrderPlaceProjector = void 0;
const Product_1 = require("../../models/Product");
const Transaction_1 = require("../../models/Transaction");
class OrderPlaceProjector {
    getCurrentState(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const state = {
                approved: false,
                date: event.date,
                products: [],
                transaction_id: "",
                user_id: ""
            };
            return state;
        });
    }
    project(currentState, event) {
        return __awaiter(this, void 0, void 0, function* () {
            const e = event;
            currentState.products = e.products;
            currentState.date = e.date;
            currentState.transaction_id = e.transaction;
            currentState.user_id = e.user_id;
            return currentState;
        });
    }
    updateState(state) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(state.products);
            Product_1.Product.collection.insertMany(state.products, (err, docs) => {
                if (err) {
                    console.log('Error to updateState Product.collection.insertMany ', err);
                }
                else {
                    var ids = docs.ops.map(doc => {
                        return doc._id;
                    });
                    console.log(ids);
                    const transaction = new Transaction_1.Transaction({
                        transaction_id: state.transaction_id,
                        products: ids,
                        user_id: state.user_id,
                        date: state.date
                    });
                    transaction.save();
                    //  console.log('document', document)
                    //STOCK CHECK AND CONFIRMATION FROM OTHER SERVICE <STOCK>
                }
            });
            return state;
        });
    }
}
exports.OrderPlaceProjector = OrderPlaceProjector;

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
exports.checkout = void 0;
const OrderService_1 = require("../events/services/OrderService");
const EventStore_1 = require("../events/stores/EventStore");
const server_1 = require("../server");
function checkout(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        /*  Product.collection.insertMany(req.body.products, (err, docs) => {
            if (err) {
                console.log(err);
            } else {
                //TODO: EVENT AND PROJECTION
                var ids = docs.ops.map(doc => {
                    return doc._id
                });
                console.log(ids);
                const transaction = new Transaction({
                    transaction_id: req.body.transaction,
                    products: ids,
                    user_id: req.body.user
                });
                transaction.save()
                //STOCK CHECK AND CONFIRMATION FROM OTHER SERVICE <STOCK>
            }
        })*/
        const c = {
            products: req.body.products, transaction: req.body.transaction, user_id: req.body.user
        };
        yield new OrderService_1.OrderService(new EventStore_1.EventStore(server_1.kafka)).checkout(c);
        res.send("success");
    });
}
exports.checkout = checkout;

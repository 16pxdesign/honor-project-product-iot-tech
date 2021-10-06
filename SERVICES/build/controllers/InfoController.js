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
exports.add = exports.ProductInfoList = exports.DeleteProductInfoById = exports.ProductInfoById = void 0;
const ProductInfo_1 = require("../models/ProductInfo");
function ProductInfoById(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const returned = yield ProductInfo_1.ProductInfo.find({ product_id: req.params.id }).exec();
        res.send(returned);
    });
}
exports.ProductInfoById = ProductInfoById;
function DeleteProductInfoById(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const returned = yield ProductInfo_1.ProductInfo.findByIdAndDelete(req.body.id).exec();
        res.send(returned);
    });
}
exports.DeleteProductInfoById = DeleteProductInfoById;
function ProductInfoList(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const returned = yield ProductInfo_1.ProductInfo.find().exec();
        res.send(returned);
    });
}
exports.ProductInfoList = ProductInfoList;
function add(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('add');
        console.log(req.body);
        const p = {
            price: req.body.price,
            product_id: req.body.product_id,
            product_id_type: req.body.product_id_type,
            product_name: req.body.product_name
        };
        console.log(p);
        const productInfoDocument = yield new ProductInfo_1.ProductInfo(p).save();
        res.send(productInfoDocument);
    });
}
exports.add = add;

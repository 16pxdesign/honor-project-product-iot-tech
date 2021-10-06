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
exports.ProductService = void 0;
const build_1 = require("../../../../escore/build");
const ProductScanHandler_1 = require("../handlers/ProductScanHandler");
class ProductService extends build_1.BaseCommandService {
    constructor(store) {
        super(store);
    }
    /*    public async createUser(email: string, password: string, role: number) {
            const c: ProductScanCommand = {
                email: email, password: password, role: role
            }
            this.commandHandler = new ProductScanHandler()
            this.projector = new UserCreateProjector()
            return this.execute(c);
        }*/
    scanned(c) {
        return __awaiter(this, void 0, void 0, function* () {
            this.commandHandler = new ProductScanHandler_1.ProductScanHandler();
            return this.execute(c);
        });
    }
}
exports.ProductService = ProductService;

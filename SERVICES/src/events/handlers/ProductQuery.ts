import { IQueryHandler } from "../../../../escore/build";
import {ProductInfo} from "../../models/ProductInfo";

export class ProductQuery implements IQueryHandler<any, any> {
    async execute(query?: any): Promise<any> {
        return await ProductInfo.find(query).exec();
    }
}
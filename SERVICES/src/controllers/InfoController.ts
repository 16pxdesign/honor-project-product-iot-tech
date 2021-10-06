import {NextFunction, Request, Response} from "express";
import {IProductInfo, ProductInfo} from "../models/ProductInfo";
import {ProductQuery} from "../events/handlers/ProductQuery";


export async function ProductInfoById(req: Request, res: Response, next: NextFunction) {
    res.send(await new ProductQuery().execute({product_id: req.params.id}))
}

export async function DeleteProductInfoById(req: Request, res: Response, next: NextFunction) {
    const returned = await ProductInfo.findByIdAndDelete(req.body.id).exec();
    res.send(returned)
}

export async function ProductInfoList(req: Request, res: Response, next: NextFunction) {
    res.send(await new ProductQuery().execute({}))

}

export async function add(req: Request, res: Response, next: NextFunction) {
    console.log('add')
    console.log(req.body)
    const p: IProductInfo = {
        price: req.body.price,
        product_id: req.body.product_id,
        product_id_type: req.body.product_id_type,
        product_name: req.body.product_name
    }
    console.log(p)
    const productInfoDocument = await new ProductInfo(p).save();
    res.send(productInfoDocument)
}

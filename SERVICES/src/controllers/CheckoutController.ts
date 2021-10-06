import {NextFunction, Request, Response} from "express";
import {OrderPlaceCommand} from "../events/commands/OrderPlaceCommand";
import {OrderService} from "../events/services/OrderService";
import {EventStore} from "../events/stores/EventStore";
import {kafka} from "../server";


export async function checkout(req: Request, res: Response, next: NextFunction) {

    const c: OrderPlaceCommand = {
        products: req.body.products, transaction: req.body.transaction, user_id: req.body.user

    }

    await new OrderService(new EventStore(kafka)).checkout(c);

    res.send("success")
}
import {kafka} from "./server";
import {OrderController} from "./controllers/OrderController";

/**
 * Entry point for order service
 */
(async () => {

    new OrderController(kafka).init()
})()


import {kafka} from "./server";
import {StockController} from "./controllers/StockController";


/**
 * Entry point for stock service
 */
(async () => {

    new StockController(kafka).init()
})()


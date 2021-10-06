import {kafka} from "./server";
import {InventoryController} from "./controllers/InventoryController";


/**
 * Entry point for inventory service
 */
(async () => {

    new InventoryController(kafka).init()
})()


import {PresenceController} from "./controllers/PresenceController";
import {kafka} from "./server";


/**
 * Entry point for presence service
 */
(async () => {

    new PresenceController(kafka).init()
})()


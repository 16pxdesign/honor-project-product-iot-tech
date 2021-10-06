import {EventType, ICommandHandler} from "../../../../escore/build";
import {StockStatusCommand} from "../commands/StockStatusCommand";
import {StockStatusEvent} from "../events/StockStatusEvent";

require('dotenv').config()

export class StockStatusHandler implements ICommandHandler<StockStatusCommand, StockStatusEvent> {

    async execute(command: StockStatusCommand): Promise<StockStatusEvent> {
   
        const event: StockStatusEvent = {
            products: command.products,
            approved: command.reason.length > 0 ? false : true,
            date: new Date(),
            reason: command.reason,
            transaction: command.transaction,
            type: command.reason.length > 0 ? EventType.ORDER_REJECTED : EventType.ORDER_APPROVED
        }
        return event;
    }


}
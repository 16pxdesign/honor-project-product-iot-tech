import {EventType, ICommandHandler } from "../../../../escore/build";
import {ReaderStateCommand} from "../commands/ReaderStateCommand";
import {Client, ReaderStateEvent} from "../events/ReaderStateEvent";
import {OrderPlaceCommand} from "../commands/OrderPlaceCommand";
import {OrderPlacedEvent} from "../events/OrderPlacedEvent";

require('dotenv').config()

export class OrderPlaceHandler implements ICommandHandler<OrderPlaceCommand, OrderPlacedEvent> {

    async execute(command: OrderPlaceCommand): Promise<OrderPlacedEvent> {
   

        const event: OrderPlacedEvent = {
            approved: false,
            date: new Date(),
            // @ts-ignore
            products: command.products.map(({_id, ...args}) => args ),
            user_id: command.user_id,
            transaction: command.transaction,
            type: EventType.ORDER_PLACED
        }
        return event;
    }


}
import {EventType, IEvent, IProjector, IState} from "../../../../escore/build";
import {UserCreatedEvent} from "../events/UserCreatedEvent";
import {UserState} from "../states/UserState";
import User, {Role} from "../../models/User"
import {OrderPlacedEvent} from "../events/OrderPlacedEvent";
import {OrderState} from "../states/OrderState";
import {Product} from "../../models/Product";
import {ITransaction, Transaction} from "../../models/Transaction";
import {stat} from "fs";

export class OrderPlaceProjector implements IProjector<OrderPlacedEvent, OrderState> {

    async current(event: OrderPlacedEvent): Promise<OrderState> {
        const state: OrderState = {
            approved: false,
            date: event.date,
            products: [],
            transaction_id: "",
            user_id: ""
        }
        return state;
    }

    async project(currentState: OrderState, event: OrderPlacedEvent): Promise<OrderState> {

        const e = event as OrderPlacedEvent;

        currentState.products = e.products;
        currentState.date = e.date;
        currentState.transaction_id = e.transaction
        currentState.user_id = e.user_id
        return currentState;

    }

    async update(state: OrderState): Promise<OrderState> {
        console.log(state.products)

        Product.collection.insertMany(state.products, (err, docs) => {
            if (err) {
                console.log('Error to updateState Product.collection.insertMany ', err);
            } else {
                var ids = docs.ops.map(doc => {
                    return doc._id;
                });
                console.log(ids);
                const transaction = new Transaction({
                    transaction_id: state.transaction_id,
                    products: ids,
                    user_id: state.user_id,
                    date: state.date
                });
                 transaction.save();
                //  console.log('document', document)
                //STOCK CHECK AND CONFIRMATION FROM OTHER SERVICE <STOCK>
            }
        })



        return state

    }


}
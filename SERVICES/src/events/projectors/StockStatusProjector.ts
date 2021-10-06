import {IProjector} from "../../../../escore/build";
import {IProduct, Product} from "../../models/Product";
import {Transaction} from "../../models/Transaction";
import {StockStatusEvent} from "../events/StockStatusEvent";
import {StockState} from "../states/StockState";
import {Stock} from "../../models/Stock";

export class StockStatusProjector implements IProjector<StockStatusEvent, StockState> {

    async current(event: StockStatusEvent): Promise<StockState> {
        let state: StockState = {product_ids: []};

        if(event.approved){
            state.product_ids = event.products;
        }

        return state;
    }

    async project(currentState: StockState, event: StockStatusEvent): Promise<StockState> {

        if(event.approved){
            console.log('currentState.product_ids', currentState.product_ids)
            for( const product of currentState.product_ids){
                const iStockDocuments = await Stock.findOneAndDelete({product_id: product}).exec();

            }
            return {product_ids: []};
        }

        return currentState;


    }

    async update(state: StockState): Promise<StockState> {

        return state

    }


}
import {StockStatusHandler} from "../src/events/handlers/StockStatusHandler";
import {StockStatusCommand} from "../src/events/commands/StockStatusCommand";

require('dotenv')


describe('stock test', () => {

    it('stock command by handler', async () => {
        const handler = new StockStatusHandler();
        const c: StockStatusCommand = {
            reason: ['no'],
            transaction: 'transaction'
        }
        const event = await handler.execute(c);
        console.log(event)
        return
    });


})

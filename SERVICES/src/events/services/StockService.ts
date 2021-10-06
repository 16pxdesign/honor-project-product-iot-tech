import {BaseCommandService, ICommand, IEvent, IState, IStore} from "../../../../escore/build";
import {OrderPlaceCommand} from "../commands/OrderPlaceCommand";
import {StockStatusHandler} from "../handlers/StockStatusHandler";
import {StockStatusProjector} from "../projectors/StockStatusProjector";
import {StockStatusCommand} from "../commands/StockStatusCommand";

export class StockService extends BaseCommandService<ICommand, IEvent, IState> {


    constructor(store: IStore) {
        super(store)
    }

    public async check(c: StockStatusCommand ) {
        this.commandHandler = new StockStatusHandler()
        this.projector = new StockStatusProjector()
        return this.execute(c)
    }




    }
import {BaseCommandService, ICommand, IState, IEvent, IStore } from "../../../../escore/build";
import {ReaderStateCommand} from "../commands/ReaderStateCommand";
import {ReaderStartScanHandler} from "../handlers/ReaderStartScanHandler";
import {ReaderStopScanHandler} from "../handlers/ReaderStopScanHandler";
import {ReaderPresentedHandler} from "../handlers/ReaderPresentedHandler";
import {OrderPlaceCommand} from "../commands/OrderPlaceCommand";
import {OrderPlaceHandler} from "../handlers/OrderPlaceHandler";
import {OrderPlaceProjector} from "../projectors/OrderPlaceProjector";

export class OrderService extends BaseCommandService<ICommand, IEvent, IState> {


    constructor(store: IStore) {
        super(store)
    }

    public async checkout(c: OrderPlaceCommand ) {
        this.commandHandler = new OrderPlaceHandler()
        this.projector = new OrderPlaceProjector()
        return this.execute(c)
    }




    }
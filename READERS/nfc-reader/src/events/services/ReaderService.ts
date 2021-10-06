import {BaseCommandService, ICommand, IEvent, IState, IStore} from "../../../../escore/build";
import {ReaderStateCommand} from "../commands/ReaderStateCommand";
import {ReaderStartScanHandler} from "../handlers/ReaderStartScanHandler";
import {ReaderStopScanHandler} from "../handlers/ReaderStopScanHandler";
import {ReaderPresentedHandler} from "../handlers/ReaderPresentedHandler";


export class ReaderService extends BaseCommandService<ICommand, IEvent, IState> {


    constructor(store: IStore) {
        super(store)
    }

    public async start(c: ReaderStateCommand ) {
        this.commandHandler = new ReaderStartScanHandler()
        return this.execute(c)
    }

    public async stop(c: ReaderStateCommand ) {
        this.commandHandler = new ReaderStopScanHandler()
        return this.execute(c)
    }

    public async present(c: ReaderStateCommand ) {
        this.commandHandler = new ReaderPresentedHandler()
        return this.execute(c)
    }



    }
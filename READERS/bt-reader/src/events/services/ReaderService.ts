import {BaseCommandService, ICommand, IEvent, IState, IStore} from "../../../../escore/build";
import {ReaderStateCommand} from "../commands/ReaderStateCommand";
import {ReaderStartScanHandler} from "../handlers/ReaderStartScanHandler";
import {ReaderStopScanHandler} from "../handlers/ReaderStopScanHandler";
import {ReaderPresentedHandler} from "../handlers/ReaderPresentedHandler";

/**
 * Service to wrap event sourcing process related to specific action
 * Reader service handle processing of commands related with reader state or presence in system.
 */
export class ReaderService extends BaseCommandService<ICommand, IEvent, IState> {


    constructor(store: IStore) {
        super(store)
    }

    //The method indicates that the scan has started.
    public async start(c: ReaderStateCommand) {
        this.commandHandler = new ReaderStartScanHandler()
        return this.execute(c)
    }

    //The method indicates that the scan has stopped.
    public async stop(c: ReaderStateCommand) {
        this.commandHandler = new ReaderStopScanHandler()
        return this.execute(c)
    }

    //The method indicates that the reader is active
    public async present(c: ReaderStateCommand) {
        this.commandHandler = new ReaderPresentedHandler()
        return this.execute(c)
    }


}
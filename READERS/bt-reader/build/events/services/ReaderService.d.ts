import { BaseCommandService, ICommand, IEvent, IState, IStore } from "../../../../escore/build";
import { ReaderStateCommand } from "../commands/ReaderStateCommand";
export declare class ReaderService extends BaseCommandService<ICommand, IEvent, IState> {
    constructor(store: IStore);
    start(c: ReaderStateCommand): Promise<void | IState>;
    stop(c: ReaderStateCommand): Promise<void | IState>;
    present(c: ReaderStateCommand): Promise<void | IState>;
}

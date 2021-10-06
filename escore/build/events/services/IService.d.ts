import { IState } from "../entities/IState";
import { IEvent } from "../events/IEvent";
import { ICommand } from "../commands/ICommand";
import { IProjector } from "../projectors/IProjector";
import { IStore } from "../stores/IStore";
import { ICommandHandler } from "../handlers/ICommandHandler";
/**
 * Service interface that execute command
 */
export interface IService {
    execute(command: ICommand): Promise<IState | void>;
}
/**
 * Abstract class that define each step during event-driven architecture.
 * Class is a middleware of whole process from producing event to returning
 * changed data.
 */
export declare abstract class BaseCommandService<Command extends ICommand, Event extends IEvent, State extends IState> implements IService {
    protected commandHandler?: ICommandHandler<Command, Event> | undefined;
    protected projector?: IProjector<Event, State> | undefined;
    protected store: IStore;
    constructor(store: IStore);
    /** Execute command and perform event actions */
    execute(command: Command): Promise<State | void>;
}

import {ICommand} from "../commands/ICommand";
import {IEvent} from "../events/IEvent";

/**
 * Generic handler where command is translated to Event and back as callback
 */
export interface ICommandHandler<Command extends ICommand,Event extends IEvent> {
    execute(command: Command): Promise<Event>;
}
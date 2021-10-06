import { ICommand } from "../../../../escore/build";
/**
 * The interface determines the structure of the command to be executed.
 * Command dedicated to change reader state
 */
export interface ReaderStateCommand extends ICommand {
    client: string;
    transaction: string;
}

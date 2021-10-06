import { ICommand } from "../../../../escore/build";
export interface ReaderStateCommand extends ICommand {
    client: string;
    transaction: string;
}

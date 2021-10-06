import {ICommand} from "../../../../escore/build";

export interface UserDeleteCommand extends ICommand{
    id: string,
}
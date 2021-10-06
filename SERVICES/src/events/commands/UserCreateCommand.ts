import {ICommand} from "../../../../escore/build";

export interface UserCreateCommand extends ICommand{
    email: string,
    password: string,
    role: number,
}
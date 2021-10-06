import {ICommand} from "../../../../escore/build";
import {Client} from "../events/ReaderStateEvent";


export interface ReaderStateCommand extends ICommand{
    reader_id: string // ID or any
    transaction: string
    client?: Client
    timeout?: number
}
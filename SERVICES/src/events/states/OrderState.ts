import {IUser, IUserAccount} from "../../models/User";
import {IState} from "../../../../escore/build";
import {ITransaction} from "../../models/Transaction";


export interface OrderState extends IState, ITransaction{
}


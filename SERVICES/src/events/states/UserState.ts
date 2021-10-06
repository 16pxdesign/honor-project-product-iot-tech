import {IUser, IUserAccount} from "../../models/User";
import {IState} from "../../../../escore/build";


export interface UserState extends IState, IUserAccount{
}

export interface UserStateDocument extends UserState{
}
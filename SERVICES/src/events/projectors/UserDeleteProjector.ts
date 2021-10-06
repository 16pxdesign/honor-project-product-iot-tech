import {IProjector} from "../../../../escore/build";
import {UserState} from "../states/UserState";
import User from "../../models/User"
import {UserDeletedEvent} from "../events/UserDeletedEvent";

export class UserDeleteProjector implements IProjector<UserDeletedEvent, UserState> {

    async current(event: UserDeletedEvent): Promise<UserState> {
        const any = await User.findById(event.id);
        if(!any)
            throw new Error('User not exist')
        return any;
    }

    async project(currentState: UserState, event: UserDeletedEvent): Promise<UserState> {

        return currentState;

    }

    async update(state: UserState): Promise<UserState> {

        const any = await User.remove(state);
        return any;
    }


}
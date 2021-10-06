import {EventType, IEvent, IProjector, IState} from "../../../../escore/build";
import {UserCreatedEvent} from "../events/UserCreatedEvent";
import {UserState} from "../states/UserState";
import User, {Role} from "../../models/User"

export class UserCreateProjector implements IProjector<UserCreatedEvent, UserState> {

    async current(_?: IEvent): Promise<UserState> {
        const state: UserState = {email: "", password: "", role: 0}
        return state;
    }

    async project(currentState: UserState, event: UserCreatedEvent): Promise<UserState> {

        const e = event as UserCreatedEvent;
        currentState._id = e.id
        currentState.email = e.email;
        currentState.password = e.password
        currentState.role = e.role
        return currentState;

    }

    async update(state: UserState): Promise<UserState> {
        return new User(state).save();
    }


}
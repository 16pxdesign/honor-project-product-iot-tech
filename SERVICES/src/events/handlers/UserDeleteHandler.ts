import {UserCreateCommand} from "../commands/UserCreateCommand";
import {UserCreatedEvent} from "../events/UserCreatedEvent";
import {EventType} from "../../../../escore/build";
import { ICommandHandler } from "../../../../escore/build";
import {UserDeleteCommand} from "../commands/UserDeleteCommand";
import {UserDeletedEvent} from "../events/UserDeletedEvent";
import User, {IUserDocument, UserView} from "../../models/User";

const uuid = require("node-uuid");

export class UserDeleteHandler implements ICommandHandler<UserDeleteCommand, UserDeletedEvent> {

    async execute(command: UserDeleteCommand): Promise<UserDeletedEvent> {
        const user = await User.findOne({_id: command.id}).select('-password');
        if(!user)
            throw new Error('User not exist')

        const event: UserDeletedEvent = {
            id: user._id,
            date: new Date(),
            email: user.email,
            role: user.role,
            type: EventType.USER_DELETED,
            transaction: uuid.v4()
        }
        return event;
    }

}
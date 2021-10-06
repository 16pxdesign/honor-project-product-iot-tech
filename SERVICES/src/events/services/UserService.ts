import {UserCreateCommand} from "../commands/UserCreateCommand";
import {BaseCommandService, ICommand, IEvent, IState, IStore} from "../../../../escore/build";
import {UserCreateHandler} from "../handlers/UserCreateHandler";
import {UserCreateProjector} from "../projectors/UserCreateProjector";
import {UserState} from "../states/UserState";
import {EventStore} from "../stores/EventStore";
import {UserDeleteCommand} from "../commands/UserDeleteCommand";
import {UserDeleteHandler} from "../handlers/UserDeleteHandler";
import {UserDeleteProjector} from "../projectors/UserDeleteProjector";

export class UserService extends BaseCommandService<ICommand, IEvent, IState> {


    constructor(store: IStore) {
        super(store)
    }


    public async createUser(c:UserCreateCommand) {
        this.commandHandler = new UserCreateHandler()
        this.projector = new UserCreateProjector()
        return this.execute(c);
    }

    public async deleteUser(c: UserDeleteCommand) {
        this.commandHandler = new UserDeleteHandler()
        this.projector = new UserDeleteProjector()
        return this.execute(c)
    }
    


    }
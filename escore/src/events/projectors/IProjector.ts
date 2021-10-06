import {IEvent} from "../events/IEvent";
import {IState} from "../entities/IState";

/**
 * Generic interface to execute any changes that event need to make
 * and return new version (state)
 */
export interface IProjector<Event extends IEvent, State extends IState> {

    /** Get current state from db */
    current(event: Event): Promise<State>;

    /** apply changes **/
    project(currentState: State, event: Event): Promise<State>;

    /** Update changes to db */
    update(state: State): Promise<State|void>;

}

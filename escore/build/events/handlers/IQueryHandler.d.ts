import { IState } from "../entities/IState";
import { IQuery } from "../queries/IQuery";
export interface IQueryHandler<Query extends IQuery, State extends IState> {
    execute(query?: Query): Promise<State>;
}

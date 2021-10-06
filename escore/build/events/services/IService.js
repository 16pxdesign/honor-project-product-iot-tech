"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCommandService = void 0;
/**
 * Abstract class that define each step during event-driven architecture.
 * Class is a middleware of whole process from producing event to returning
 * changed data.
 */
class BaseCommandService {
    constructor(store) {
        this.store = store;
    }
    /** Execute command and perform event actions */
    execute(command) {
        return __awaiter(this, void 0, void 0, function* () {
            // execute command handler
            if (!this.commandHandler)
                throw new Error('Missing command handler');
            const event = yield this.commandHandler.execute(command);
            if (this.projector) {
                //fetch current state
                let state = yield this.projector.current(event);
                //apply changes into state
                state = yield this.projector.project(state, event);
                //update state
                state = (yield this.projector.update(state)) || state;
                //publish event to store
                yield this.store.publish(event);
                return state;
            }
            else {
                //publish event to store
                yield this.store.publish(event);
                return;
            }
        });
    }
}
exports.BaseCommandService = BaseCommandService;

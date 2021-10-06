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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserService_1 = require("../src/events/services/UserService");
const EventStore_1 = require("../src/events/stores/EventStore");
const build_1 = require("../../escore/build");
const chai_1 = require("chai");
const UserDeleteHandler_1 = require("../src/events/handlers/UserDeleteHandler");
const UserDeleteProjector_1 = require("../src/events/projectors/UserDeleteProjector");
require('dotenv');
const Dump = mongoose_1.default.model('Dump', new mongoose_1.default.Schema({ name: String }));
before((done) => {
    const host = process.env.MONGOOSE_HOST_TEST || 'mongodb://root:example@localhost:27017/';
    mongoose_1.default.connect(host, { useNewUrlParser: true })
        .then(() => {
        console.log('Mongo ready.');
        done();
    })
        .catch(done);
});
afterEach((done) => {
    // Dump.db.dropDatabase(done)
    done();
});
after((done) => {
    mongoose_1.default.disconnect(done);
});
describe('Delete user', () => {
    it('delete by handler', () => __awaiter(void 0, void 0, void 0, function* () {
        const handler = new UserDeleteHandler_1.UserDeleteHandler();
        const c = {
            id: "6061664b7a643eaf77a02993"
        };
        const event = yield handler.execute(c);
        console.log(event);
        chai_1.expect(event.type).to.equal(build_1.EventType.USER_DELETED);
        return Promise.resolve();
    }));
    it('delete by projetor', () => __awaiter(void 0, void 0, void 0, function* () {
        const handler = new UserDeleteHandler_1.UserDeleteHandler();
        const c = {
            id: "6061664b7a643eaf77a02993"
        };
        const event = yield handler.execute(c);
        const projector = new UserDeleteProjector_1.UserDeleteProjector();
        const userState = yield projector.getCurrentState(event);
        console.log(userState);
        const userState1 = yield projector.project(userState, event);
        const userState2 = yield projector.updateState(userState1);
        console.log(userState2);
        return Promise.resolve();
    }));
    it('delete by service', () => __awaiter(void 0, void 0, void 0, function* () {
        const c = {
            id: '60616702d40720b1a6376a31'
        };
        yield new UserService_1.UserService(new EventStore_1.EventStore()).deleteUser(c);
        return Promise.resolve();
    }));
    it('Mongo connection', () => __awaiter(void 0, void 0, void 0, function* () {
        const any = yield Dump.find({});
        return Promise.resolve();
    }));
});

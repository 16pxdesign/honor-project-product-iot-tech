"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const UserCreateProjector_1 = require("../src/events/projectors/UserCreateProjector");
const UserCreateHandler_1 = require("../src/events/handlers/UserCreateHandler");
const UserService_1 = require("../src/events/services/UserService");
const User_1 = __importStar(require("../src/models/User"));
const EventStore_1 = require("../src/events/stores/EventStore");
const chai_1 = require("chai");
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
describe('Event sourcing', () => {
    it('Is command create events', () => __awaiter(void 0, void 0, void 0, function* () {
        const c = {
            email: "email", password: "password", role: User_1.Role.Home
        };
        const e = yield new UserCreateHandler_1.UserCreateHandler().execute(c);
        console.log(e);
        return Promise.resolve();
    }));
    it('Testing event store respond on event ', () => __awaiter(void 0, void 0, void 0, function* () {
        const store = new EventStore_1.EventStore();
        const e = {
            id: "123",
            date: new Date(),
            email: 'email',
            password: 'password',
            role: 0,
            type: 'USER CREATED',
            transaction: '2e79134d-e4c1-4899-8e93-88970682585a'
        };
        yield store.publish(e);
        return Promise.resolve();
    }));
    it('Test projecting data for event and state', () => __awaiter(void 0, void 0, void 0, function* () {
        const e = {
            id: "123",
            date: new Date(),
            email: 'email',
            password: 'password',
            role: 0,
            type: 'USER CREATED',
            transaction: '2e79134d-e4c1-4899-8e93-88970682585a'
        };
        const projector = new UserCreateProjector_1.UserCreateProjector();
        const state = yield projector.getCurrentState();
        const r1 = { email: '', password: '', role: 0 };
        chai_1.expect(state).to.deep.equal(r1);
        const project = yield projector.project(state, e);
        const r2 = { email: 'email', password: 'password', role: 0 };
        chai_1.expect(project).to.deep.equal(r2);
        const save = yield projector.updateState(project);
        const r3 = save;
        const doesUserExit = yield User_1.default.exists({ _id: r3._id });
        chai_1.expect(doesUserExit).true;
        return Promise.resolve();
    }));
    it('Test whole service for creating user', () => __awaiter(void 0, void 0, void 0, function* () {
        const eventStore = new EventStore_1.EventStore();
        const userService = new UserService_1.UserService(eventStore);
        const c = {
            email: 'test@ego.com', password: 'hashPassword', role: User_1.Role.Home
        };
        const any = yield userService.createUser(c);
        const r4 = any;
        chai_1.expect(r4.email).to.equal('email');
        chai_1.expect(r4.password).to.equal('hash');
        chai_1.expect(r4.role).to.equal(User_1.Role.Admin);
        const doesUserExit = yield User_1.default.exists({ _id: r4._id });
        chai_1.expect(doesUserExit).true;
        return Promise.resolve();
    }));
    it('Mongo connection', () => __awaiter(void 0, void 0, void 0, function* () {
        const any = yield Dump.find({});
        return Promise.resolve();
    }));
});

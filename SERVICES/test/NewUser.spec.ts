import mongoose from 'mongoose';
import {UserCreateCommand} from "../src/events/commands/UserCreateCommand";
import {UserCreateProjector} from "../src/events/projectors/UserCreateProjector";
import {UserCreateHandler} from "../src/events/handlers/UserCreateHandler";
import {UserService} from "../src/events/services/UserService";
import User, {IUserAccountDocument, Role} from "../src/models/User";
import {EventStore} from "../src/events/stores/EventStore";
import {UserCreatedEvent} from "../src/events/events/UserCreatedEvent";
import {expect} from 'chai';
import {UserState} from "../src/events/states/UserState";

require('dotenv')

const Dump = mongoose.model('Dump', new mongoose.Schema({name: String}));

before((done) => {
    const host: string = process.env.MONGOOSE_HOST_TEST || 'mongodb://root:example@localhost:27017/';
    mongoose.connect(host, {useNewUrlParser: true})
        .then(() => {
            console.log('Mongo ready.')
            done()
        })
        .catch(done);

})
afterEach((done) => {
    // Dump.db.dropDatabase(done)
    done()
})

after((done) => {
    mongoose.disconnect(done)


});

describe('Event sourcing', () => {

    it('Is command create events', async () => {
        const c: UserCreateCommand = {
            email: "email", password: "password", role: Role.Home
        }
        const e = await new UserCreateHandler().execute(c)
        console.log(e)
        return Promise.resolve()
    });

    it('Testing event store respond on event ', async () => {
        const store = new EventStore();
        const e: UserCreatedEvent = {
            id: "123",
            date: new Date(),
            email: 'email',
            password: 'password',
            role: 0,
            type: 'USER CREATED',
            transaction: '2e79134d-e4c1-4899-8e93-88970682585a'
        }
        await store.publish(e)
        return Promise.resolve()
    });


    it('Test projecting data for event and state', async () => {
        const e: UserCreatedEvent = {
            id: "123",
            date: new Date(),
            email: 'email',
            password: 'password',
            role: 0,
            type: 'USER CREATED',
            transaction: '2e79134d-e4c1-4899-8e93-88970682585a'
        }
        const projector = new UserCreateProjector();
        const state = await projector.current();
        const r1: UserState = {email: '', password: '', role: 0}
        expect(state).to.deep.equal(r1)

        const project = await projector.project(state, e);
        const r2: UserState = {email: 'email', password: 'password', role: 0}
        //expect(project).to.deep.equal(r2)

        const save = await projector.update(project);
        const r3 = save as IUserAccountDocument;

        const doesUserExit = await User.exists({_id: r3._id});
        expect(doesUserExit).true
        return Promise.resolve()
    });

    it('Test whole service for creating user', async () => {
        const eventStore = new EventStore();
        const userService = new UserService(eventStore);
        const c: UserCreateCommand = {
            email: 'test@ego.com', password: 'hashPassword', role: Role.Home
        }
        const any = await userService.createUser(c);
        const r4 = any as IUserAccountDocument;
        expect(r4.email).to.equal('email')
        expect(r4.password).to.equal('hash')
        expect(r4.role).to.equal(Role.Admin)
        const doesUserExit = await User.exists({_id: r4._id});
        expect(doesUserExit).true
        return Promise.resolve()
    });


    it('Mongo connection', async () => {
        const any = await Dump.find({});
        return Promise.resolve()

    });


})

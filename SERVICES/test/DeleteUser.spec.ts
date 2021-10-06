import mongoose from 'mongoose';
import {UserService} from "../src/events/services/UserService";
import {EventStore} from "../src/events/stores/EventStore";
import {EventType} from '../../escore/build';
import {expect} from 'chai';
import {UserDeleteHandler} from "../src/events/handlers/UserDeleteHandler";
import {UserDeleteCommand} from "../src/events/commands/UserDeleteCommand";
import {UserDeleteProjector} from "../src/events/projectors/UserDeleteProjector";
import {UserDeletedEvent} from "../src/events/events/UserDeletedEvent";

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

describe('Delete user', () => {

    it('delete by handler', async () => {
        const handler = new UserDeleteHandler();
        const c : UserDeleteCommand = {
            id: "6061664b7a643eaf77a02993"
        }
        const event = await handler.execute(c);
        console.log(event)
        expect(event.type).to.equal(EventType.USER_DELETED)
        return Promise.resolve()
    });

    it('delete by projetor', async () => {
        const handler = new UserDeleteHandler();
        const c : UserDeleteCommand = {
            id: "6061664b7a643eaf77a02993"
        }
        const event: UserDeletedEvent = await handler.execute(c);
        const projector = new UserDeleteProjector();
        const userState = await projector.current(event);
        console.log(userState)
        const userState1 = await projector.project(userState,event);
        const userState2 = await projector.update(userState1);
        console.log(userState2)
        return Promise.resolve()
    });

    it('delete by service', async () => {
        const c: UserDeleteCommand = {
        id: '60616702d40720b1a6376a31'
    }
    await new UserService(new EventStore()).deleteUser(c)
        return Promise.resolve()
    });
    it('Mongo connection', async () => {
        const any = await Dump.find({});
        return Promise.resolve()

    });


})

/*
import * as events from "events";
import {MaximumListenerExceeded, ReaderHandler, UniqueListenerExist} from "../ReaderHandler";
import {expect} from "chai";

describe('Delete user', () => {
    var eventEmitter = new events.EventEmitter();
    it('test validation',  async() => {
        await ReaderHandler.getInstance().setLister(eventEmitter,'on',()=>{},'cli','1');
        let err0 = await ReaderHandler.getInstance().validation(eventEmitter,'foo','0');
            console.log(err0) //false
            expect(err0).to.equal(false)
        console.log('---')
        let err1 = await ReaderHandler.getInstance().validation(eventEmitter,'cli','0');
            console.log(err1) //false
            expect(err1).to.equal(false)
        console.log('---')
        let err2 = await ReaderHandler.getInstance().validation(eventEmitter,'cli','1');
             //console.log(err2)
        expect(err2).to.be.an.instanceof(UniqueListenerExist);
        return
    });

    it('test unique listeners',  () => {

        const fn = (data:any) =>{
            return function () {            console.log('I hear a %s ',data);        }
        }
        ReaderHandler.getInstance().setLister(eventEmitter,'on',fn('1'),'cli','1');
        ReaderHandler.getInstance().setLister(eventEmitter,'on',fn('2'),'cli','2');
        ReaderHandler.getInstance().setLister(eventEmitter,'on',fn('3'),'cli','3');
        ReaderHandler.getInstance().setLister(eventEmitter,'on',fn('4'),'cli','4');
        ReaderHandler.getInstance().setLister(eventEmitter,'on',fn('5'),'cli','5');
        ReaderHandler.getInstance().setLister(eventEmitter,'on',fn('6'),'cli','6');
        eventEmitter.emit('on');
        console.log('----')
        ReaderHandler.getInstance().deleteListener(eventEmitter,'cli','on','1')
        ReaderHandler.getInstance().deleteListener(eventEmitter,'cli','on','3')
        eventEmitter.emit('on');
        console.log('----')
        ReaderHandler.getInstance().deleteListener(eventEmitter,'cli','on','5')
        eventEmitter.emit('on');

    });

    it('test size limit for anonymous listeners',  async() => {
        for(var i = 0; i<20; i++){
            await ReaderHandler.getInstance().setLister(eventEmitter,'on',()=>{},'cli','1');
            console.log(eventEmitter.listenerCount('on'))
            console.log(eventEmitter.getMaxListeners())
            console.log(eventEmitter.rawListeners('on'))
            console.log('--')
        }

        return
    });

    it('test validation function',  async() => {
        ReaderHandler.getInstance().max_listeners = 2
        await ReaderHandler.getInstance().setLister(eventEmitter, 'on', () => {        }, 'cli', '1');
        let err1 = await ReaderHandler.getInstance().validation(eventEmitter,'xx','0');
        console.log(err1)//false
        expect(err1).to.equal(false)
        await ReaderHandler.getInstance().setLister(eventEmitter, 'on', () => {        }, 'cli', '1');
        let err2 = await ReaderHandler.getInstance().validation(eventEmitter,'xx','0');
        //console.log(err2)
        expect(err2).to.be.an.instanceof(MaximumListenerExceeded);

        return
    });

    it('test validation retry max',  async() => {

        ReaderHandler.getInstance().max_listeners = 20
        await ReaderHandler.getInstance().setValidatedListener(eventEmitter, 'on', () => {        }, 'cli', '1');
        await ReaderHandler.getInstance().setValidatedListener(eventEmitter, 'on', () => {        }, 'cli', '2');
        await ReaderHandler.getInstance().setValidatedListener(eventEmitter, 'on', () => {        }, 'cli', '3');
        await ReaderHandler.getInstance().setValidatedListener(eventEmitter, 'on', () => {        }, 'cli', '4');
        await ReaderHandler.getInstance().setValidatedListener(eventEmitter, 'on', () => {        }, 'cli', '5');

        return
    })



})*/

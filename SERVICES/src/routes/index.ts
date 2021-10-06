import {NextFunction, Request, Response, Router} from "express";
import * as index from '../controllers/index'

import * as UserController from "../controllers/UserController";
import passport from "passport";

const router = Router();
let kafka:any;

/*
router.get('/www', index.scan);

router.post('/register', UserController.register);
router.post('/get', UserController.getAll);
router.post('/test',  function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err); // will generate a 500 error
        }
        // Generate a JSON response reflecting authentication status
        if (! user) {
            return res.send({ success : false, message : 'authentication failed' , info: info});
        }
        req.login(user, function(err){
            if(err){
                return next(err);
            }
            return res.send({ success : true, message : 'authentication succeeded' });
        });
    })(req, res, next);
});

router.post('/login',passport.authenticate("local"), UserController.login);

router.get('/kafka', async (req: Request, res: Response, next: NextFunction)=>{

    const kafkaStore = new KafkaStore(kafka)
    const scanService = new KafkaScanService(new ScanCommandHandler(),[kafkaStore])


    let command: IScanCommand = {
        client: 'from_web',
        type: eventTypes.START_RD_SCAN,
        request_device_id: "all",
        period: 0
    };

    scanService.execute(command)


    res.send('Event sent')
});

router.get('/testjson', async (req: Request, res: Response, next: NextFunction)=> {
    let event = new DataEvent();
    event.type = eventTypes.RD_SCAN_CONFIRM;
    const s = JSON.stringify(event);
    const parse = JSON.parse(s);
    const e: IDataEvent = new DataEvent(parse);

    e.save();

    res.send('ok sent')

})

router.get('/', index.scan);


export default (pass:any)=>{
    console.log('def')
    kafka = pass;
    return router;
};
*/


export default router
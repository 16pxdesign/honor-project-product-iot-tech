import logger from 'morgan';
import express from 'express';
import cookieParser from 'cookie-parser';
import path from "path";
import expressLayouts from "express-ejs-layouts";
import config from "./config/config";
import mongoose from "mongoose";
import {Kafka} from "kafkajs";
import session from 'express-session'
import cors from 'cors';
import passport from "passport";
import initPassport from "./middleware/passport";
import indexRoute from "./routes/index";
import inventoryRoute from "./routes/inventory";
import checkoutRoute from "./routes/checkout";
import stockRoute from "./routes/stock";
import readerRoute from "./routes/reader";
import infoRoute from "./routes/info";
import userRoute from "./routes/user";
import orderRoute from "./routes/order";
import http from 'http'

// create express app
export const app = express();
//create http server
export const server = http.createServer(app);

const MongoDBStore = require('connect-mongodb-session')(session);

initPassport(passport);
console.log('Connecting mognose.. ', config.mongo.hostname, config.mongo.options)
// connect to mongo db
mongoose.connect(config.mongo.hostname, config.mongo.options)
    .then(() => console.log('Mongo ready.'))
    .catch(err => {
            console.log('Problem with database connection: ' + err.message)
            process.exit(1)
        }
    );

export const mongoDBStore = new MongoDBStore({
    uri: config.mongo.hostname,
    collection: 'store_sessions'
}, (error: any) => {
    if (error) console.log(error)
});

// view engine setupserver
app.use(expressLayouts);
app.set('layout', 'layout');
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// logger
app.use(logger('dev'));

export const origins = ["http://localhost:3000", "http://127.0.0.1:3000", 'http://192.168.1.14:3000/']
app.use(cors({origin: origins, credentials: true}))

// parsing
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

//static routs
//app.use(express.static(path.join(__dirname, 'public')));

// session
export const session_var: any = session({
    name: 'connect.sid',
    secret: 'secret',
    resave: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    //key: 'express.sid',
    saveUninitialized: true,
    store: mongoDBStore,
});
app.use(session_var);

//Passport
app.use(passport.initialize());
app.use(passport.session());

//kafka
const clientId = config.clientID
export const kafka = new Kafka({
    clientId: clientId,
    brokers: [config.kafka_host],
    retry: {retries: 100}
});


/*app.use((req: Request, res: Response, next: NextFunction)=>{
   // console.log('req',req.session)
    next()
})*/
//routes
app.use('/checkout', checkoutRoute)
app.use('/inventory', inventoryRoute)
app.use('/stock', stockRoute)
app.use('/info', infoRoute)
app.use('/order', orderRoute)
app.use('/readers', readerRoute)
app.use('/user', userRoute)
//app.use('/', indexRoute(kafka))

//start main app.
server.listen(config.server.port, () => {
    console.log(`API app listening at http://${config.server.hostname}:${config.server.port}`)
})







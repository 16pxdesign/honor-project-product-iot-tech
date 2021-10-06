"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.kafka = exports.session_var = exports.origins = exports.mongoDBStore = exports.server = void 0;
const morgan_1 = __importDefault(require("morgan"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const express_ejs_layouts_1 = __importDefault(require("express-ejs-layouts"));
const config_1 = __importDefault(require("./config/config"));
const mongoose_1 = __importDefault(require("mongoose"));
const kafkajs_1 = require("kafkajs");
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
const passport_2 = __importDefault(require("./middleware/passport"));
const inventory_1 = __importDefault(require("./routes/inventory"));
const checkout_1 = __importDefault(require("./routes/checkout"));
const stock_1 = __importDefault(require("./routes/stock"));
const reader_1 = __importDefault(require("./routes/reader"));
const info_1 = __importDefault(require("./routes/info"));
const user_1 = __importDefault(require("./routes/user"));
const order_1 = __importDefault(require("./routes/order"));
const http_1 = __importDefault(require("http"));
// create express app
const app = express_1.default();
//create http server
exports.server = http_1.default.createServer(app);
const MongoDBStore = require('connect-mongodb-session')(express_session_1.default);
passport_2.default(passport_1.default);
console.log('Connecting mognose.. ', config_1.default.mongo.hostname, config_1.default.mongo.options);
// connect to mongo db
mongoose_1.default.connect(config_1.default.mongo.hostname, config_1.default.mongo.options)
    .then(() => console.log('Mongo ready.'))
    .catch(err => {
    console.log('Problem with database connection: ' + err.message);
    process.exit(1);
});
exports.mongoDBStore = new MongoDBStore({ uri: config_1.default.mongo.hostname, collection: 'store_sessions' }, (error) => { if (error)
    console.log(error); });
// view engine setupserver
app.use(express_ejs_layouts_1.default);
app.set('layout', 'layout');
app.set('views', path_1.default.join(__dirname, '/views'));
app.set('view engine', 'ejs');
// logger
app.use(morgan_1.default('dev'));
exports.origins = ["http://localhost:3000", "http://127.0.0.1:3000", 'http://192.168.1.14:3000/'];
app.use(cors_1.default({ origin: exports.origins, credentials: true }));
// parsing
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookie_parser_1.default());
//static routs
//app.use(express.static(path.join(__dirname, 'public')));
// session
exports.session_var = express_session_1.default({
    name: 'connect.sid',
    secret: 'secret',
    resave: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    //key: 'express.sid',
    saveUninitialized: true,
    store: exports.mongoDBStore,
});
app.use(exports.session_var);
//Passport
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
const clientId = config_1.default.clientID;
exports.kafka = new kafkajs_1.Kafka({
    clientId: clientId,
    brokers: [config_1.default.kafka_host],
    retry: { retries: 100 }
});
/*app.use((req: Request, res: Response, next: NextFunction)=>{
   // console.log('req',req.session)
    next()
})*/
app.use('/checkout', checkout_1.default);
app.use('/inventory', inventory_1.default);
app.use('/stock', stock_1.default);
app.use('/info', info_1.default);
app.use('/order', order_1.default);
app.use('/readers', reader_1.default);
app.use('/user', user_1.default);
//app.use('/', indexRoute(kafka))
exports.server.listen(config_1.default.server.port, () => {
    console.log(`API app listening at http://${config_1.default.server.hostname}:${config_1.default.server.port}`);
});

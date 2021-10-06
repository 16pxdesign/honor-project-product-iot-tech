"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_local_1 = __importDefault(require("passport-local"));
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const LocalStrategy = passport_local_1.default.Strategy;
function default_1(passport) {
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser((id, done) => {
        User_1.default.findById({ _id: id }, function (err, user) {
            done(err, user);
        });
    });
    passport.use('local', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, (email, password, done) => {
        console.log('login.local');
        User_1.default.findOne({ email: email }, (err, user) => {
            if (err)
                throw err;
            console.log('user %s', user);
            if (!user)
                return done(null, false);
            bcryptjs_1.default.compare(password, user.password, (err, result) => {
                if (err)
                    throw err;
                if (result === true) {
                    return done(null, user);
                }
                else {
                    return done(null, false);
                }
            });
        });
    }));
}
exports.default = default_1;

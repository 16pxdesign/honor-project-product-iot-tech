import passport from "passport";
import passportLocal from 'passport-local';
import User, {IUser, IUserAccountDocument} from "../models/User";
import bcrypt from 'bcryptjs';

const LocalStrategy = passportLocal.Strategy

/**
 * Passport strategy implementation
 * @param passport
 */
export default function (passport: any) {

    passport.serializeUser((user: IUser, done: any) => {
        done(null, user._id);
    });

    passport.deserializeUser((id: string, done: any) => {
        User.findById({_id: id}, function (err: any, user: IUserAccountDocument) {
            done(err, user);
        });
    });

    passport.use('local', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        }, (email: string, password: string, done) => {
            console.log('login.local')
            User.findOne({email: email}, (err: any, user: IUserAccountDocument) => {
                if (err) throw err;
                console.log('user %s', user)
                if (!user) return done(null, false);
                bcrypt.compare(password, user.password, (err, result: boolean) => {
                    if (err) throw err;
                    if (result === true) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                });
            });
        })
    );


}
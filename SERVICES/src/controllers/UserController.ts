import {NextFunction, Request, Response} from "express";
import User, {Role} from "../models/User";

import passport from "passport";
import bcrypt from 'bcryptjs';
import {UserService} from "../events/services/UserService";
import {UserCreateCommand} from "../events/commands/UserCreateCommand";
import {UserDeleteCommand} from "../events/commands/UserDeleteCommand";
import {KAFKA} from "../config/config";
import {EventStore} from "../events/stores/EventStore";

export function logout(req: Request, res: Response, next: NextFunction) {
    req.logout();
    res.send("success")
}


export async function register(req: Request, res: Response, next: NextFunction) {

    const doesUserExit = await User.exists({email: req.body.email});

    if (doesUserExit) {
        return res.send("Registration fail")
    }
    if (!req.body.role) { //temporary
        req.body.role = 0
    }
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const c: UserCreateCommand = {
        email: req.body.email, password: hashPassword, role: req.body.role
    }
    const user = await new UserService(new EventStore(KAFKA)).createUser(c);
    return res.send("success");
}

export function login(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err); // will generate a 500 error
        }
        if (!user) {
            return res.send({success: false, message: 'Authentication failed', info: info});
        }
        req.login(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.send("success");
        });
    })(req, res, next);
}

export async function getUsers(req: Request, res: Response, next: NextFunction) {
    const documents = await User.find({}, {_id: 1, email: 1, role: 1}).exec();
    console.log(JSON.stringify(documents))
    return res.send(documents)
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {

    if (!req.body.id)
        return res.send('Request fail - no id')
    const id = req.body.id
    const isExist = await User.exists({_id: id});
    if (!isExist)
        return res.send('Request fail - not exist')
    const c: UserDeleteCommand = {
        id: id
    }
    new UserService(new EventStore(KAFKA)).deleteUser(c).then(() => {
        return res.send('success')
    }).catch(() => {
        return res.send('Request fail - Service err')
    })

}


/**
 * debug
 * @param req
 * @param res
 * @param next
 */

export function getAll(req: Request, res: Response, next: NextFunction) {
    User.find({}).exec().then((query) => {
        console.log(query[0].role == Role.Home)
    });

    return res.send('ok')
}
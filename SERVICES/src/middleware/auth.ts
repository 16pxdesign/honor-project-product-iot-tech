import {NextFunction, Request, Response, Router} from "express";

//check is user is authorised
 export function auth (req: Request, res: Response, next:NextFunction) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.status(403);
        res.send('No access');
    }

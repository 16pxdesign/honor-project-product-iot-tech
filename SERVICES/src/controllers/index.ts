import {NextFunction, Request, Response} from "express";

export function scan(req: Request, res: Response, next: NextFunction){

    res.send('Hello world');
}
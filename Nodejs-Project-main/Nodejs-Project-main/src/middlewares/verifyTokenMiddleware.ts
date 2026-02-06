import jwt from "jsonwebtoken";
import {Request, Response, NextFunction} from 'express';
import CustomJwtPayload from "../interfaces/jwtPayloadInterface.ts";

declare global {
    namespace Express {
        interface Request {
            permissions: number[];
            role?: number;
            userId?: number;
        }
    }
}

const tokenValidation = (req: Request, res: Response, next: NextFunction): void | Response => {
    const token = req.cookies?.access_token;

    if (!token) {
        return res.sendStatus(401);
    }


    if (!process.env.TOKEN_SECRET) {
        console.error("TOKEN_SECRET environment variable is not defined!");
        return res.status(500).send("Server configuration error.");
    }

    try {
        const data = jwt.verify(token, process.env.TOKEN_SECRET) as CustomJwtPayload;

        console.log(data);


        req.userId = data.userId;
        req.role = data.role;
        req.permissions = data.permissions;

        return next();
    } catch (error: unknown) {
        console.error("Token verification failed:", error);
        return res.sendStatus(403);
    }
};


export default tokenValidation;

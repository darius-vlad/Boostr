import {Request, Response, NextFunction} from 'express';


declare global {
    namespace Express {
        interface Request {
            permissions: number[];
        }
    }
}

const authorization = (requiredPermissions: number[]) => async (req: Request, res: Response, next: NextFunction) => {
    const userPermissions: number[] = req.permissions;
    let authorized = true;
    for (let requiredPermission of requiredPermissions) {
        if (!userPermissions.includes(requiredPermission)) {
            authorized = false
        }
    }

    if (!authorized) {
        return res.sendStatus(403).send("You do not have the permission to use this!")
    } else {
        next();
    }

}

export default authorization
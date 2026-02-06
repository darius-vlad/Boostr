import {Request, Response, NextFunction} from 'express';


const validate = (schema: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req);
        await schema.validate(req.body, {abortEarly: false});
        next();
    } catch (error: unknown) {
        if (error instanceof Error)
            res.status(400).json({errors: error.message})
        else {
            res.status(500).json({error: "Something went wrong when validating the token."})
        }
    }
}

export default validate
import {Request, Response} from 'express';

interface IUserController {
    saveAllUsersToFile: (req: Request, res: Response) => Promise<void>;
    getAllUsers: (req: Request, res: Response) => Promise<void>;
    findUserById: (req: Request, res: Response) => Promise<void>;
    deleteUserById: (req: Request, res: Response) => Promise<void>;
    updateUser: (req: Request, res: Response) => Promise<void>;
    uploadPhoto: (req: Request, res: Response) => Promise<void>;
    getCurrentUser: (req: Request, res: Response) => Promise<void>
    updateCurrentUser: (req: Request, res: Response) => Promise<void>
}

export default IUserController
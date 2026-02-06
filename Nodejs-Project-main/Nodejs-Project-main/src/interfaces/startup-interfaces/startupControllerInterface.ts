import {Request, Response} from 'express';

interface IStartupController {
    getAllStartups: (req: Request, res: Response) => Promise<Response>;
    createStartup: (req: Request, res: Response) => Promise<Response>;
    getStartupById: (req: Request, res: Response) => Promise<Response>;
    deleteStartupById: (req: Request, res: Response) => Promise<Response>;
    updateStartupById: (req: Request, res: Response) => Promise<Response>;
    getCurrentUsersStartups: (req: Request, res: Response) => Promise<Response>;
    getStartupsForUserWithId: (req: Request, res: Response) => Promise<Response>;
    getStartupsForShowcase: (req: Request, res: Response) => Promise<Response>;
    // getSearchedStartups: (req: Request, res: Response) => Promise<Response>;
    // getFilteredStartups: (req: Request, res: Response) => Promise<Response>;

    filterAndSearchStartups: (req: Request, res: Response) => Promise<Response>;
}

export default IStartupController
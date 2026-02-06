import {Request, Response} from 'express';

interface IPerksController {
    getAllPerks: (req: Request, res: Response) => Promise<Response>;
    getAllPerksForStartup: (req: Request, res: Response) => Promise<Response>
    createPerk: (req: Request, res: Response) => Promise<Response>;
    getPerkById: (req: Request, res: Response) => Promise<Response>
    deletePerkById: (req: Request, res: Response) => Promise<Response>
    updatePerkById: (req: Request, res: Response) => Promise<Response>

}

export default IPerksController;
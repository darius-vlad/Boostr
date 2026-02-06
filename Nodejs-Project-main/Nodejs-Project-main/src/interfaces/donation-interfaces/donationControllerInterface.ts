import {Request, Response} from 'express';

interface DonationControllerInterface {
    getAllDonations: (req: Request, res: Response) => Promise<Response>;

    createDonation: (req: Request, res: Response) => Promise<Response>;

    findDonationById: (req: Request, res: Response) => Promise<Response>;

    deleteDonationById: (req: Request, res: Response) => Promise<Response>;

}

export default DonationControllerInterface;
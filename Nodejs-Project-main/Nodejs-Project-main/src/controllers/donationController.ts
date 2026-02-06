import DonationControllerInterface from "../interfaces/donation-interfaces/donationControllerInterface.ts";
import {Request, Response} from 'express';
import donationService from "../services/donationService.ts";
import Donation from "../interfaces/donation-interfaces/donationInterface.ts";


declare global {
    namespace Express {
        interface Request {
            userId?: number;
        }
    }
}

const donationController: DonationControllerInterface =
    {
        getAllDonations: async (req: Request, res: Response): Promise<Response> => {
            try {
                const allDonations = await donationService.getAllDonations()
                return res.status(200).send(allDonations)
            } catch (e) {
                if (e instanceof Error) {
                    return res.status(400).json({error: e.message})
                } else {
                    return res.status(500).json({error: "Unknown error when fetching donations!"})
                }
            }
        },


        createDonation: async (req: Request, res: Response): Promise<Response> => {
            try {
                const donorId = req.userId;

                if (donorId === undefined) {
                    return res.status(401).json({error: "Authentication required: User ID not found."});
                }

                const donationData =
                    {
                        ...req.body,
                        donor_id: donorId
                    }


                await donationService.createDonation(donationData)
                return res.status(200).json({message: "Donation has been created!"})
            } catch (e) {
                if (e instanceof Error) {
                    return res.status(400).json({error: e.message})
                } else {
                    return res.status(500).json({error: "Unknown error when creating donation!"})
                }
            }
        },


        findDonationById: async (req: Request, res: Response): Promise<Response> => {
            try {

                const id = parseInt(req.params.id);
                if (isNaN(id)) {
                    return res.status(400).json({error: " Wrong Donation ID provided."});
                }

                let donation: Donation = await donationService.findDonationById(id);
                return res.status(200).send(donation)
            } catch (e) {
                if (e instanceof Error) {
                    return res.status(400).json({error: e.message});
                } else {
                    return res.status(500).json({error: "Unknown error when getting donation!"})
                }
            }
        },


        deleteDonationById: async (req: Request, res: Response): Promise<Response> => {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({error: "Wrong donation ID provided!"})
            }
            try {
                await donationService.deleteDonationByID(id)
                return res.status(200).json({message: "Donation has been deleted!"})
            } catch (e) {
                if (e instanceof Error) {
                    return res.status(400).json({error: e.message})
                } else {
                    return res.status(500).json({error: "Unknown error when deleting donation"})
                }
            }
        }


    }

export default donationController
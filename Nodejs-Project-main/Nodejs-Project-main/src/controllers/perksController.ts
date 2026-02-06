import perksService from "../services/perksService.ts";
import IPerksController from "../interfaces/perks-interfaces/perksControllerInterface.ts";
import {Request, Response} from 'express';
import Perk from "../interfaces/perks-interfaces/perkInterface.ts";

const perksController: IPerksController =
    {
        getAllPerks: async (req: Request, res: Response): Promise<Response> => {
            try {
                console.log(req)
                let perks = await perksService.getAllPerks()
                return res.status(200).send(perks)
            } catch (e) {
                if (e instanceof Error)
                    return res.status(400).json({error: e.message})
                else {
                    return res.status(500).json({error: "An unknown error occurred while fetching all perks."});
                }
            }
        },

        getAllPerksForStartup: async (req: Request, res: Response): Promise<Response> => {
            try {
                console.log(req)
                const startupId = parseInt(req.params.id)
                let perks = await perksService.getPerksForStartup(startupId)
                return res.status(200).send(perks)
            } catch (e) {
                if (e instanceof Error)
                    return res.status(400).json({error: e.message})
                else {
                    return res.status(500).json({error: "An unknown error occurred while fetching perks assigned to this startup."});
                }
            }
        },

        createPerk: async (req: Request, res: Response): Promise<Response> => {
            try {
                await perksService.createPerk(parseInt(req.params.id), req.body)
                return res.status(200).json({message: "Perk has been added to your startup!"})
            } catch (e) {
                return res.status(400).json({error: "Unable to add perk!"})
            }
        },

        getPerkById: async (req: Request, res: Response): Promise<Response> => {
            try {
                console.log(req)
                let perk: Perk = await perksService.findPerkById(parseInt(req.params.perkId))
                return res.status(200).send(perk)

            } catch (e) {
                if (e instanceof Error)
                    return res.status(400).json({error: e.message})
                else
                    return res.status(500).json({error: "Unknown error when finding perk with given id!"})
            }
        },

        deletePerkById: async (req: Request, res: Response): Promise<Response> => {
            try {
                await perksService.deletePerkById(parseInt(req.params.perkId))
                return res.status(200).json({message: "Perk has been deleted"})
            } catch (e) {
                if (e instanceof Error)
                    return res.status(400).json({error: e.message})
                else
                    return res.status(500).json({error: "Unknown error when deleting perk with given id!"})
            }
        },

        updatePerkById: async (req: Request, res: Response): Promise<Response> => {

            try {
                await perksService.updatePerkById(parseInt(req.params.perkId), req.body)
                return res.status(200).json({message: "Perk has been updated"})
            } catch (e) {
                if (e instanceof Error)
                    return res.status(400).json({error: e.message})
                else
                    return res.status(500).json({error: "Unknown error when updating!"})
            }
        }
    };


export default perksController;
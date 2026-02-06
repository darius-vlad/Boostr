import startupService from "../services/startupService.ts";
import Startup from "../interfaces/startup-interfaces/startupInterface.ts";
import IStartupController from "../interfaces/startup-interfaces/startupControllerInterface.ts";
import {Request, Response} from 'express';
import StartupCreateInput from "../interfaces/startup-interfaces/startupCreateInterface.ts";
import StartupUpdateInput from "../interfaces/startup-interfaces/startupUpdateInterface.ts";
import userService from "../services/userService.js";
import tagService from "../services/tagService.js";
import startupInterface from "../interfaces/startup-interfaces/startupInterface.ts";

declare global {
    namespace Express {
        interface Request {
            userId?: number;
        }
    }
}

const startupController: IStartupController = {
    getAllStartups: async (req: Request, res: Response): Promise<Response> => {
        try {
            const allStartups: Startup[] = await startupService.getAllStartups();
            return res.status(200).send(allStartups);
        } catch (e: unknown) {
            console.error("Error fetching all startups:", e);
            if (e instanceof Error) {
                return res.status(500).json({error: e.message});
            } else {
                return res.status(500).json({error: "An unknown error occurred while fetching all startups."});
            }
        }
    },

    getCurrentUsersStartups: async (req: Request, res: Response): Promise<Response> => {
        const userId = req.userId;
        if (userId === undefined) {
            return res.status(401).json({error: "User ID not found in token."});

        }

        try {
            const allStartupsForUser: Startup[] = await startupService.getAllStartupsForUser(userId);
            return res.status(200).send(allStartupsForUser);
        } catch (e: unknown) {
            console.error("Error fetching all startups for user:", e);
            if (e instanceof Error) {
                return res.status(500).json({error: e.message});
            } else {
                return res.status(500).json({error: "An unknown error occurred while fetching all startups for user."});
            }
        }
    },

    getStartupsForUserWithId: async (req: Request, res: Response): Promise<Response> => {
        const userId = req.params.id;
        try {
            const allStartupsForUser: Startup[] = await startupService.getAllStartupsForUser(parseInt(userId));
            return res.status(200).send(allStartupsForUser);
        } catch (e: unknown) {
            console.error("Error fetching all startups for user:", e);
            if (e instanceof Error) {
                return res.status(500).json({error: e.message});
            } else {
                return res.status(500).json({error: "An unknown error occurred while fetching all startups for user."});
            }
        }
    },


    createStartup: async (req: Request, res: Response): Promise<Response> => {
        try {
            const founderId = req.userId;

            if (founderId === undefined) {
                return res.status(401).json({error: "Authentication required: User ID not found."});
            }

            const {tags, ...startupBody} = req.body;

            const startupData: StartupCreateInput = {
                ...startupBody,
                founder_id: founderId
            };

            let newStartup = await startupService.createStartup(startupData, tags || []);
            return res.status(201).send(newStartup);
        } catch (e: unknown) {
            console.error("Error creating startup:", e);
            if (e instanceof Error) {
                return res.status(400).json({error: e.message});
            } else {
                return res.status(500).json({error: "An unknown error occurred while creating the startup."});
            }
        }
    },

    getStartupById: async (req: Request, res: Response): Promise<Response> => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({error: "Invalid startup ID provided."});
            }
            const startup: Startup = await startupService.findStartupById(id);
            const tags = await tagService.getTagForStartup(startup.id)
            let startupObject = {...startup, tags}
            return res.status(200).send(startupObject);
        } catch (e: unknown) {
            if (e instanceof Error) {
                return res.status(404).json({error: e.message});
            } else {
                return res.status(500).json({error: "An unknown error occurred while fetching startup by ID."});
            }
        }
    },

    deleteStartupById: async (req: Request, res: Response): Promise<Response> => {
        let startup: Startup | undefined;
        const startupId = parseInt(req.params.id);

        if (isNaN(startupId)) {
            return res.status(400).json({error: "Invalid startup ID provided."});
        }

        try {
            startup = await startupService.findStartupById(startupId);
        } catch (e: unknown) {
            if (e instanceof Error) {
                return res.status(404).json({error: e.message});
            } else {
                return res.status(500).json({error: "An unknown error occurred during startup lookup for deletion."});
            }
        }
        const userId = req.userId;
        if (userId === undefined) {
            return res.status(401).json({error: "Authentication required: User ID not found."});
        }

        if (startup.founder_id !== userId) {
            return res.status(403).json({error: "Unauthorized: You are not the founder of this startup."});
        }

        try {
            await startupService.deleteStartupById(startupId);
            return res.status(200).json({message: "Startup has been deleted!"});
        } catch (e: unknown) {
            console.error("Error deleting startup:", e);
            if (e instanceof Error) {
                return res.status(400).json({error: e.message});
            } else {
                return res.status(500).json({error: "An unknown error occurred during startup deletion."});
            }
        }
    },


    updateStartupById: async (req: Request, res: Response): Promise<Response> => {
        const startupId = parseInt(req.params.id);

        if (isNaN(startupId)) {
            return res.status(400).json({error: "Invalid startup ID provided."});
        }

        try {
            const existingStartup = await startupService.findStartupById(startupId);

            const userId = req.userId;
            if (userId === undefined) {
                return res.status(401).json({error: "Authentication required: User ID not found."});
            }
            if (existingStartup.founder_id !== userId) {
                return res.status(403).json({error: "Unauthorized: You are not the founder of this startup to update it."});
            }


            const startupUpdateData: StartupUpdateInput = req.body;
            await startupService.updateStartupById(startupId, startupUpdateData);
            return res.status(200).json({message: "Startup has been updated!"});
        } catch (e: unknown) {
            console.error("Error updating startup:", e);
            if (e instanceof Error) {
                if (e.message.includes("Startup with given id does not exist!")) {
                    return res.status(404).json({error: e.message});
                }
                return res.status(400).json({error: e.message});
            } else {
                return res.status(500).json({error: "An unknown error occurred during startup update."});
            }
        }
    },


    getStartupsForShowcase: async (req: Request, res: Response): Promise<Response> => {
        try {
            const filter = req.params.filter;
            const startups = await startupService.getStartupsForShowcase(filter)
            return res.status(200).send(startups)
        } catch (e) {
            if (e instanceof Error) {
                return res.status(404).json({error: e.message});
            } else {
                return res.status(500).json({error: "Unknown server error when fetching startups"})
            }
        }
    },

    // getSearchedStartups: async (req: Request, res: Response): Promise<Response> => {
    //     try {
    //         const keywords = req.params.keywords;
    //         const filteredStartups = await startupService.searchStartups(keywords);
    //         return res.status(200).send(filteredStartups);
    //
    //     } catch (e) {
    //         if (e instanceof Error) {
    //             return res.status(404).json({error: e.message});
    //         } else {
    //             return res.status(500).json({error: "Unknown server error when fetching startups"})
    //         }
    //     }
    // },
    //
    // getFilteredStartups: async (req: Request, res: Response): Promise<Response> => {
    //     try {
    //         const sortBy = req.params.sortBy;
    //         const categories = req.params.categories;
    //         const filteredStartups = await startupService.filterStartups(sortBy, categories)
    //         return res.status(200).send(filteredStartups)
    //     } catch (e) {
    //         if (e instanceof Error) {
    //             return res.status(404).json({error: e.message});
    //         } else {
    //             return res.status(500).json({error: "Unknown server error when fetching startups"})
    //         }
    //     }
    //
    // },


    filterAndSearchStartups: async (req: Request, res: Response): Promise<Response> => {
        try {

            const sortBy = req.query.sortBy as string | undefined;
            const categories = req.query.categories as string | undefined;
            const searchQuery = req.query.q as string | undefined;

            const startups = await startupService.filterAndSearchStartups(sortBy, categories, searchQuery);

            return res.status(200).json(startups);
        } catch (e: unknown) {
            console.error("Error filtering/searching startups:", e);
            if (e instanceof Error) {
                return res.status(500).json({error: e.message});
            }
            return res.status(500).json({error: "An unknown error occurred."});
        }
    }
};

export default startupController
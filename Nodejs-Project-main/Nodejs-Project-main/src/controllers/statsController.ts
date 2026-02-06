import statsService from "../services/statsService.js";
import {Request, Response} from 'express';
import StatsInterface from "../interfaces/stats-interfaces/statsInterface.js";

declare global {
    namespace Express {
        interface Request {
            userId?: number;
        }
    }
}


const statsController =
    {
        getUserStats: async (req: Request, res: Response): Promise<Response> => {
            try {
                const userId = req.params.userId
                const userStats: StatsInterface = await statsService.getUserStats(parseInt(userId))
                return res.status(200).send(userStats)
            } catch (e) {
                if (e instanceof Error) {
                    return res.status(404).json({error: e.message});
                } else {
                    return res.status(500).json({error: "Unknown server error when getting the users stats!"})
                }
            }
        },


        getUsersForLeaderboard: async (req: Request, res: Response): Promise<Response> => {
            try {
                const metric = req.params.metric;
                const users = await statsService.getUsersForLeaderboard(metric);
                return res.status(200).send(users);
            } catch (e) {
                if (e instanceof Error) {
                    return res.status(404).json({error: e.message})
                } else {
                    return res.status(500).json({error: "Unknown server error when loading leaderboard"})
                }
            }
        }
    }


export default statsController
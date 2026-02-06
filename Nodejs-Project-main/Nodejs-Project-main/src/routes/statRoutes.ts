import express, {Router, Request, Response, NextFunction} from 'express';
import statsController from "../controllers/statsController.js";

const statRouter = express.Router()


statRouter.get("/stats/:userId", statsController.getUserStats)
statRouter.get("/leaderboard/:metric", statsController.getUsersForLeaderboard)

export default statRouter
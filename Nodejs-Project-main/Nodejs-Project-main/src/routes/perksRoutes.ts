import express, {Router, Request, Response, NextFunction} from "express";
import perksController from "../controllers/perksController.ts";
import tokenValidation from "../middlewares/verifyTokenMiddleware.ts";

const perksRoutes = express.Router()


perksRoutes.get("/startups/:id/perks/:perkId", tokenValidation, perksController.getPerkById)
perksRoutes.delete("/startups/:id/perks/:perkId", tokenValidation, perksController.deletePerkById)
perksRoutes.put("/startups/:id/perks/:perkId", tokenValidation, perksController.updatePerkById)
perksRoutes.get("/perks", tokenValidation, perksController.getAllPerks);
perksRoutes.get("/startups/:id/perks", tokenValidation, perksController.getAllPerksForStartup)
perksRoutes.post("/startups/:id/perks", tokenValidation, perksController.createPerk)


export default perksRoutes
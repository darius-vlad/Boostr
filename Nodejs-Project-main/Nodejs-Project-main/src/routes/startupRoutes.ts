import express, {Router, Request, Response, NextFunction} from 'express';
import startupController from "../controllers/startupController.ts";
import tokenValidation from "../middlewares/verifyTokenMiddleware.ts";


const startupRoutes = express.Router()

startupRoutes.get("/startups/me", tokenValidation, startupController.getCurrentUsersStartups)
startupRoutes.get("/startups/showcase/:filter", startupController.getStartupsForShowcase)
startupRoutes.get("/startups", tokenValidation, startupController.getAllStartups)
startupRoutes.post("/startups", tokenValidation, startupController.createStartup)

startupRoutes.get("/startups/filter", startupController.filterAndSearchStartups);

startupRoutes.get("/startups/:id", startupController.getStartupById)
startupRoutes.delete("/startups/:id", tokenValidation, startupController.deleteStartupById)
startupRoutes.put("/startups/:id", tokenValidation, startupController.updateStartupById)
// startupRoutes.get("/startups/searched/:keywords", startupController.getSearchedStartups)
// startupRoutes.get("/startups/filtered/:sortBy&:categories", startupController.getFilteredStartups)


export default startupRoutes
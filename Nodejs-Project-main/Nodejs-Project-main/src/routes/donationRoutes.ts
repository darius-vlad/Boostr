import express from "express";
import tokenValidation from "../middlewares/verifyTokenMiddleware.js";
import donationController from "../controllers/donationController.js";

const donationRoutes = express.Router();


donationRoutes.post("/donation", tokenValidation, donationController.createDonation)


export default donationRoutes
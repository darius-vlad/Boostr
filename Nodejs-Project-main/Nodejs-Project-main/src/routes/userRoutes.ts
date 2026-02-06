import express, {Request, Response, NextFunction, Router} from 'express';
import userController from "../controllers/userController.ts";
import tokenValidation from "../middlewares/verifyTokenMiddleware.ts";
import authorization from "../middlewares/authorizationMiddleware.ts";
import multer from "multer";
import path from "node:path";
import startupController from "../controllers/startupController.js";

const userRouter = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
})

const upload = multer({dest: "uploads/", storage: storage})

//userRouter.get("/message", authorization, userController.testSendMessage) - For Testing
//userRouter.post("/users", userController.insertUser) - Now implemented in Signup
//userRouter.get('/saveToFile', userController.saveAllUsersToFile)

// userRouter.post("/profile-pic-test", upload.single('profile-pic'), (req, res) => {
//     if (!req.file) {
//         return res.status(400)
//     } else {
//         res.send("File uploaded!")
//     }
// })

userRouter.get('/users/me', tokenValidation, userController.getCurrentUser);
userRouter.put("/users/me", tokenValidation, userController.updateCurrentUser)
userRouter.post('/users/me/photo', tokenValidation, upload.single('profile-pic'), userController.uploadPhoto)
userRouter.get('/users', tokenValidation, authorization([2]), userController.getAllUsers)
userRouter.get("/users/:id", tokenValidation, authorization([2]), userController.findUserById)
userRouter.delete("/users/:id", tokenValidation, authorization([1]), userController.deleteUserById)
userRouter.put("/users/:id", tokenValidation, authorization([1]), userController.updateUser)
userRouter.post("/users/:id/photo", tokenValidation, upload.single('profile-pic'), userController.uploadPhoto)
userRouter.get("/users/:id/startups", tokenValidation, startupController.getStartupsForUserWithId)
export default userRouter
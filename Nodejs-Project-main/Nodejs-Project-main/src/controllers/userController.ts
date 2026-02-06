import UserUpdateInput from "../interfaces/user-interfaces/userUpdateInterface.ts";
import userService from "../services/userService.ts";
import writeJsonToFile from "../utils/utils.ts";
import {Request, Response} from 'express';
import User from "../interfaces/user-interfaces/userInterface.ts";
import IUserController from "../interfaces/user-interfaces/userControllerInterface.ts";

declare global {
    namespace Express {
        interface Request {
            userId?: number;
            file?: Multer.File;
        }
    }
}

const userController: IUserController = {
    saveAllUsersToFile: async (req: Request, res: Response): Promise<void> => {
        try {
            const allUsers: User[] = await userService.getAllUsers();
            writeJsonToFile(allUsers);
            res.send("Data has been written!");
        } catch (e: unknown) {
            console.error("Error saving users to file:", e);
            if (e instanceof Error) {
                res.status(500).json({error: e.message});
            } else {
                res.status(500).json({error: "An unknown error occurred while saving users to file."});
            }
        }
    },

    getAllUsers: async (req: Request, res: Response): Promise<void> => {
        try {
            const allUsers: User[] = await userService.getAllUsers();
            res.send(allUsers);
        } catch (e: unknown) {
            console.error("Error getting all users:", e);
            if (e instanceof Error) {
                res.status(500).json({error: e.message});
            } else {
                res.status(500).json({error: "An unknown error occurred while fetching all users."});
            }
        }
    },

    findUserById: async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({error: "Invalid user ID provided."});
                return;
            }
            const user: User = await userService.findUserById(id);
            res.send(user);
        } catch (e: unknown) {
            if (e instanceof Error) {
                res.status(404).json({error: e.message});
            } else {
                res.status(500).json({error: "An unknown error occurred while finding user by ID."});
            }
        }
    },

    deleteUserById: async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({error: "Invalid user ID provided."});
                return;
            }
            await userService.deleteUserById(id);
            res.status(200).json({message: "User has been deleted!"});
        } catch (e: unknown) {
            if (e instanceof Error) {
                res.status(400).json({error: e.message});
            } else {
                res.status(500).json({error: "An unknown error occurred during user deletion."});
            }
        }
    },

    updateUser: async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({error: "Invalid user ID provided."});
                return;
            }
            const userObject: UserUpdateInput = req.body;
            await userService.updateUser(id, userObject);
            res.status(200).json({message: "User has been updated!"});
        } catch (e: unknown) {
            if (e instanceof Error) {
                res.status(400).json({error: e.message});
            } else {
                res.status(500).json({error: "An unknown error occurred during user update."});
            }
        }
    },

    updateCurrentUser: async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.userId
            if (id === undefined) {
                res.status(401).json({error: "User ID not found in token."});
                return;
            }
            const userObject: UserUpdateInput = req.body;
            await userService.updateUser(id, userObject);
            res.status(200).json({message: "User has been updated!"});
        } catch (e: unknown) {
            if (e instanceof Error) {
                res.status(400).json({error: e.message});
            } else {
                res.status(500).json({error: "An unknown error occurred during user update."});
            }
        }
    },
    getCurrentUser: async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.userId;
            if (userId === undefined) {
                res.status(401).json({error: "User ID not found in token."});
                return;
            }

            let user: User = await userService.findUserById(userId)
            res.send(user);

        } catch (e: unknown) {
            if (e instanceof Error) {
                res.status(400).json({error: `Error finding user: ${e.message}`});
                return;
            } else {
                res.status(500).json({error: 'Unknown error when fetching current user.'})
                return;
            }
        }
    },

    uploadPhoto: async (req: Request, res: Response): Promise<void> => {
        try {
            const imageInfo: string[] = req.file!.originalname.split(".")
            const extension: string = imageInfo[imageInfo?.length - 1]
            const userId: number | undefined = req.userId;
            const filePath: string | undefined = req.file?.path + "." + extension;

            if (userId === undefined) {
                res.status(401).json({error: "User ID not found in token."});
                return;
            }
            if (!filePath) {
                res.status(400).json({error: "No file uploaded or file path missing."});
                return;
            }
            console.log(filePath)
            console.log(userId)

            await userService.uploadProfilePic(userId, req.file!.filename);
            res.status(200).json({message: "Profile picture has been uploaded."});
        } catch (e: unknown) {
            console.error("Error uploading picture:", e);
            if (e instanceof Error) {
                res.status(400).json({error: `Error uploading picture: ${e.message}`});
            } else {
                res.status(500).json({error: "An unknown error occurred while uploading picture."});
            }
        }
    }
};

export default userController
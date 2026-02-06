import authService from "../services/authService.ts";
import {Request, Response} from 'express';

const authController =
    {
        signup: async (req: Request, res: Response): Promise<void> => {
            try {
                console.log(req)
                await authService.signup(req.body)
                res.status(200).json({message: "Successfully registered!"})
            } catch (e) {
                if (e instanceof Error) {
                    console.log(e)
                    res.status(401).json({error: e.message})
                } else {
                    res.status(500).json({erorr: "There was an error signing you up."})
                }
            }
        }

        ,
        login: async (req: Request, res: Response): Promise<void> => {
            try {
                let token: string = await authService.login(req.body.email, req.body.password)
                res.cookie("access_token", token, {
                    httpOnly: true
                }).send("Successful Login")
            } catch (e) {
                if (e instanceof Error) {
                    res.status(401).json({error: e.message})
                } else {
                    res.status(500).json({error: "THere was an error logging you in"})
                }
            }
        },

        logout: async (req: Request, res: Response) => {
            return res.clearCookie("access_token").status(200).json({message: "Successfully logged out!"})
        }

    }


export default authController
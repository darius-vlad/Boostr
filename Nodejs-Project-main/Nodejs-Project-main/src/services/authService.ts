import userService from "./userService.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import dotenv from 'dotenv/config'
import connection from "../config/db_connection.ts";
import UserCreateInput from "../interfaces/user-interfaces/userCreateInterface.ts";
import User from "../interfaces/user-interfaces/userInterface.ts";
import {RowDataPacket, Connection, FieldPacket} from 'mysql2/promise';


interface PermissionRow extends RowDataPacket {
    id: number;
}

const authService =
    {
        async signup(user: UserCreateInput) {
            const hashedPassword = await bcrypt.hash(user.password, 10)
            let created_at = new Date();
            try {
                await connection.promise().query("INSERT INTO user (name , email ,password,created_at , profile_bio) VALUES(? , ? , ? ,?,?)", [user.name, user.email, hashedPassword, created_at, user.profile_bio ?? "User currently has no description"])
            } catch (e) {
                throw e
            }
        },


        async login(email: string, password: string) {
            let user: User
            try {
                user = await userService.findUserByEmail(email)
            } catch (e) {
                throw new Error("User with given email does not exist!");
            }
            const passwordMatch = await bcrypt.compare(password, user.password)
            if (!passwordMatch) {
                throw new Error("Wrong password!");
            }

            let [permissions, data]: [PermissionRow[], FieldPacket[]] = await connection.promise().query("SELECT p.id FROM user u JOIN roles_permissions rp on u.role_id = rp.role_id JOIN permissions p on rp.permission_id = p.id WHERE u.id =?", [user.id])
            let newPermissions: number[] = permissions.map(permission => permission.id)
            if (!process.env.TOKEN_SECRET) {
                throw new Error("The secret token is not defined");
            }
            const token = jwt.sign({
                    userId: user.id,
                    role: user.role_id,
                    permissions: newPermissions
                }, process.env.TOKEN_SECRET,
                {
                    expiresIn: '6h',
                })

            return token
        }
    }

export default authService
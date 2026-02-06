import connection from "../config/db_connection.ts";
import bcrypt from "bcrypt";
import User from "../interfaces/user-interfaces/userInterface.ts";
import {ResultSetHeader} from "mysql2";
import UserUpdateInput from "../interfaces/user-interfaces/userUpdateInterface.ts";
import IUserService from "../interfaces/user-interfaces/userServiceInterface.ts";


const userService: IUserService = {

    async getAllUsers(): Promise<User[]> {
        const [rows] = await connection.promise().query <User[]>("SELECT * FROM user");
        return rows;
    },

    async insertUser(name: string, email: string, password_raw: string): Promise<void> {
        const hashedPassword = await bcrypt.hash(password_raw, 10);
        await connection.promise().query <ResultSetHeader>(
            "INSERT INTO user (name, email, password) VALUES(?, ?, ?)",
            [name, email, hashedPassword]
        );
    },

    async findUserById(id: number): Promise<User> {
        try {
            const [rows] = await connection.promise().query <User[]>("SELECT * FROM user WHERE id = ?", [id]);
            if (rows.length === 0) {
                throw new Error("User with the given id does not exist!");
            }
            return rows[0];
        } catch (err: unknown) {
            if (err instanceof Error) {
                throw err;
            }
            throw new Error("An unknown error occurred while finding user by ID.");
        }
    },


    async deleteUserById(id: number): Promise<void> {
        try {
            await this.findUserById(id);
            const [result] = await connection.promise().query <ResultSetHeader>("DELETE FROM user WHERE id = ?", [id]);
            if (result.affectedRows === 0) {
                throw new Error("Failed to delete user: User not found or no rows affected.");
            }
        } catch (e: unknown) {
            if (e instanceof Error) {
                throw e;
            }
            throw new Error("An unknown error occurred during user deletion process.");
        }
    },


    async updateUser(userId: number, userObject: UserUpdateInput): Promise<void> {
        try {
            await this.findUserById(userId);
        } catch (e: unknown) {
            if (e instanceof Error) {
                throw e;
            }
            throw new Error("An unknown error occurred during user existence check for update.");
        }
        try {
            const updateFields: string[] = [];
            const updateValues: (string | number | null)[] = [];

            if (userObject.name !== undefined) {
                updateFields.push("name = ?");
                updateValues.push(userObject.name);
            }

            if (userObject.profile_bio !== undefined) {
                updateFields.push("profile_bio = ?");
                updateValues.push(userObject.profile_bio)
            }
            if (userObject.email !== undefined) {
                updateFields.push("email = ?");
                updateValues.push(userObject.email);
            }
            if (userObject.password !== undefined) {
                const hashedPassword = await bcrypt.hash(userObject.password, 10);
                updateFields.push("password = ?");
                updateValues.push(hashedPassword);
            }
            if (userObject.profile_pic_path !== undefined) {
                updateFields.push("profile_pic_path = ?");
                updateValues.push(userObject.profile_pic_path);
            }

            if (updateFields.length === 0) {
                console.warn(`No fields provided to update for user ID: ${userId}`);
                return;
            }

            const query = `UPDATE user
                           SET ${updateFields.join(" , ")}
                           WHERE id = ?`;
            await connection.promise().query <ResultSetHeader>(query, [...updateValues, userId]);

        } catch (e: unknown) {
            if (e instanceof Error) {
                throw e;
            }
            throw new Error("An unknown error occurred during user update.");
        }
    },


    async findUserByEmail(email: string): Promise<User> {
        try {
            const [rows] = await connection.promise().query <User[]>("SELECT * FROM user WHERE email = ?", [email]);
            if (rows.length === 0) {
                throw new Error("User does not exist");
            }
            return rows[0];
        } catch (e: unknown) {
            if (e instanceof Error) {
                throw e;
            }
            throw new Error("An unknown error occurred while finding user by email.");
        }
    },


    async uploadProfilePic(id: number, path: string): Promise<void> {
        try {
            await connection.promise().query <ResultSetHeader>("UPDATE user SET profile_pic_path = ? WHERE id = ?", [path, id]);
        } catch (e: unknown) {
            if (e instanceof Error) {
                throw e;
            }
            throw new Error("An unknown error occurred during profile picture upload.");
        }
    }


};


export default userService
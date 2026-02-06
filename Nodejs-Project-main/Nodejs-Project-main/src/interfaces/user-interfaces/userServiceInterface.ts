import User from "./userInterface.ts";
import UserUpdateInput from "./userUpdateInterface.ts";

interface IUserService {
    getAllUsers(): Promise<User[]>;

    insertUser(name: string, email: string, password_raw: string): Promise<void>;

    findUserById(id: number): Promise<User>;

    deleteUserById(id: number): Promise<void>;

    updateUser(userId: number, userObject: UserUpdateInput): Promise<void>;

    findUserByEmail(email: string): Promise<User>;

    uploadProfilePic(id: number, path: string): Promise<void>;

}

export default IUserService
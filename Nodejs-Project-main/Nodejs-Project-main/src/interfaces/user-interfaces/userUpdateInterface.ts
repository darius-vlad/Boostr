interface UserUpdateInput {
    name?: string;
    email?: string;
    password?: string;
    profile_bio?: string;
    profile_pic_path?: string | null;
}

export default UserUpdateInput
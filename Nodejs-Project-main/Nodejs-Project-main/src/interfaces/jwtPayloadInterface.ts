import jwt from "jsonwebtoken";

interface CustomJwtPayload extends jwt.JwtPayload {
    userId: number;
    role: number;
    permissions: number[];

}

export default CustomJwtPayload
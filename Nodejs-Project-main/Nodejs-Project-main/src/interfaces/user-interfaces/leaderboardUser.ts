import {RowDataPacket} from "mysql2";

export interface LeaderboardUser extends RowDataPacket{
    id: number;
    name: string;
    profile_pic_path: string | null;
    metric: number | string;
}
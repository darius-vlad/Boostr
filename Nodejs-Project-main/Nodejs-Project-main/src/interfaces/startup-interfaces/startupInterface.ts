import {RowDataPacket} from "mysql2";

interface Startup extends RowDataPacket {
    id: number;
    founder_id: number;
    name: string;
    description: string;
    funding_goal: number;
    created_at: Date;
    current_funding: number;
}

export default Startup
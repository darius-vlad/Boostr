import {RowDataPacket} from "mysql2";

interface Perk extends RowDataPacket {
    id: number;
    title: string;
    description: string;
    minimum_donation_amount: number;
    startup_id: number;
}

export default Perk;
import {RowDataPacket} from "mysql2";

interface Donation extends RowDataPacket {
    id: number,
    startup_id: number,
    amount: number,
    donated_at: Date,
    perk_id?: number
    donor_id: number
}

export default Donation
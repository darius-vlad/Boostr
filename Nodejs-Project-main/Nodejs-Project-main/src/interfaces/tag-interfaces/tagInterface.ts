import {RowDataPacket} from "mysql2";

interface Tag extends RowDataPacket {
    id: number,
    name: string
}

export default Tag
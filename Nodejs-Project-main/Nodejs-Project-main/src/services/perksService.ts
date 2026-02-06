import connection from "../config/db_connection.ts";
import Perk from "../interfaces/perks-interfaces/perkInterface.ts";
import IPerkService from "../interfaces/perks-interfaces/perkServiceInterface.ts";
import {ResultSetHeader} from "mysql2";
import PerkCreateInput from "../interfaces/perks-interfaces/perkCreateInterface.ts";
import perkUpdateInterface from "../interfaces/perks-interfaces/perkUpdateInterface.ts";

const perkService: IPerkService = {
    async getAllPerks(): Promise<Perk[]> {
        let myResult
        try {
            [myResult] = await connection.promise().query<Perk[]>("SELECT * FROM perks");
            return myResult;
        } catch (e: unknown) {
            throw e
        }
    },


    async getPerksForStartup(startupId: number): Promise<Perk[]> {
        let myResult
        try {
            [myResult] = await connection.promise().query<Perk[]>("SELECT * FROM perks WHERE startup_id = ?", [startupId]);
            return myResult;
        } catch (e: unknown) {
            throw e
        }
    },

    async createPerk(startupId: number, perkObject: PerkCreateInput): Promise<void> {
        console.log(perkObject);
        try {
            await connection.promise().query<ResultSetHeader>(
                "INSERT INTO perks(title, description, minimum_donation_amount, startup_id) VALUES(?,?,?,?)",
                [perkObject.title, perkObject.description, perkObject.minimum_donation_amount, startupId]
            );
        } catch (e: unknown) {
            throw e;
        }
    }
    ,

    async findPerkById(perkId: number): Promise<Perk> {

        try {
            const [rows] = await connection.promise().query<Perk[]>("SELECT * FROM perks WHERE id = ?", [perkId]);

            if (rows.length === 0) {
                throw new Error("Perk with given id does not exist!");
            }
            return rows[0];
        } catch (err: unknown) {
            if (err instanceof Error) {
                throw err;
            }
            throw new Error("An unknown error occurred while finding perk by ID.");
        }
    },

    async deletePerkById(perkId: number): Promise<void> {
        try {

            await this.findPerkById(perkId);
            const [result] = await connection.promise().query<ResultSetHeader>("DELETE FROM perks WHERE id = ?", [perkId]);
            if (result.affectedRows === 0) {
                throw new Error("Failed to delete perk: Perk not found or no rows affected.");
            }
        } catch (e: unknown) {
            if (e instanceof Error) {
                throw e;
            }
            throw new Error("An unknown error occurred during perk deletion process.");
        }
    },

    async updatePerkById(perkId: number, perkObject: perkUpdateInterface): Promise<void> {
        try {
            await this.findPerkById(perkId)
        } catch (e: unknown) {
            if (e instanceof Error) {
                throw e;
            }
            throw new Error("An unknown error occurred during startup existence check for update.");
        }

        try {
            const updateFields: string[] = []
            const updateValues: (string | number)[] = [];

            if (perkObject.title !== undefined) {
                updateFields.push("title= ?")
                updateValues.push(perkObject.title);
            }

            if (perkObject.minimum_donation_amount !== undefined) {
                updateFields.push("minimum_donation_amount= ?")
                updateValues.push(perkObject.minimum_donation_amount)
            }

            if (perkObject.description !== undefined) {
                updateFields.push("description= ?")
                updateValues.push(perkObject.description)
            }

            if (updateFields.length === 0) {
                console.warn(`No fields provided to update for startup ID: ${perkId}`);
                return;
            }

            const query = `UPDATE perks
                           SET ${updateFields.join(" , ")}
                           WHERE id = ?`;
            await connection.promise().query<ResultSetHeader>(query, [...updateValues, perkId]);

        } catch (e: unknown) {
            if (e instanceof Error) {
                throw e;
            }
            throw new Error("An unknown error occurred during startup update.");
        }
    }

};


export default perkService
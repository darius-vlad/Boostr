import donationServiceInterface from "../interfaces/donation-interfaces/donationServiceInterface.ts";
import Donation from "../interfaces/donation-interfaces/donationInterface.ts";
import connection from "../config/db_connection.ts";
import DonationCreateInterface from "../interfaces/donation-interfaces/donationCreateInterface.ts";
import {ResultSetHeader} from "mysql2";
import Perk from "../interfaces/perks-interfaces/perkInterface.js";

const donationService: donationServiceInterface =
    {
        async getAllDonations(): Promise<Donation[]> {
            try {
                const [rows] = await connection.promise().query<Donation[]>("SELECT * FROM donation");
                return rows;
            } catch (e: unknown) {
                if (e instanceof Error) {
                    throw e;
                }
                throw new Error("An unknown error occurred while fetching all startups.");
            }
        },


        async createDonation(donationObject: DonationCreateInterface): Promise<void> {
            const created_at: Date = new Date();
            try {
                await connection.promise().query<ResultSetHeader>("INSERT INTO donation (startup_id, donor_id, amount, donated_at, perk_id) VALUES (?,?,?,?,?)", [donationObject.startup_id, donationObject.donor_id, donationObject.amount, created_at, donationObject.perk_id ?? null])
                const updateStartupSql = "UPDATE startup SET current_funding = current_funding + ? WHERE id = ?";
                const startupParams = [donationObject.amount, donationObject.startup_id];
                await connection.promise().query(updateStartupSql, startupParams)
            } catch (e) {
                if (e instanceof Error) {
                    throw e;
                }
                throw new Error("An unknown error occurred while donating.")
            }
        },


        async findDonationById(donationId: number): Promise<Donation> {
            try {
                const [rows] = await connection.promise().query<Donation[]>("SELECT * FROM donation WHERE id = ?", [donationId]);

                if (rows.length === 0) {
                    throw new Error("Donation with given id does not exist!");
                }
                return rows[0];
            } catch (err: unknown) {
                if (err instanceof Error) {
                    throw err;
                }
                throw new Error("An unknown error occurred while finding donation by ID.");
            }
        },


        async deleteDonationByID(donationId: number): Promise<void> {
            try {
                await this.findDonationById(donationId);
                const [result] = await connection.promise().query<ResultSetHeader>("DELETE FROM donation WHERE id = ?", [donationId]);
                if (result.affectedRows === 0) {
                    throw new Error("Failed to delete perk: Perk not found or no rows affected.");
                }
            } catch (e: unknown) {
                if (e instanceof Error) {
                    throw e;
                }
                throw new Error("An unknown error occurred during perk deletion process.");
            }
        }


    }

export default donationService
import connection from "../config/db_connection.js";
import StatsInterface from "../interfaces/stats-interfaces/statsInterface.js";
import {RowDataPacket} from "mysql2";
import {LeaderboardUser} from "../interfaces/user-interfaces/leaderboardUser.js";


interface TotalResult extends RowDataPacket {
    total: number;
}

const statsService =
    {
        async getUserStats(userId: number) {
            try {


                const [total_donated_rows] = await connection.promise().query<TotalResult[]>(
                    "SELECT COALESCE(SUM(amount), 0) AS total FROM donation WHERE donor_id = ?",
                    [userId]
                );
                const total_donated = total_donated_rows[0].total;


                const [startups_donated_to_rows] = await connection.promise().query<TotalResult[]>(
                    "SELECT COUNT(DISTINCT startup_id) AS total FROM donation WHERE donor_id = ?",
                    [userId]
                );
                const startups_donated_to = startups_donated_to_rows[0].total;


                const [startup_created_rows] = await connection.promise().query<TotalResult[]>(
                    "SELECT COUNT(*) AS total FROM startup WHERE founder_id = ?",
                    [userId]
                );
                const startups_created = startup_created_rows[0].total;


                const [money_raised_rows] = await connection.promise().query<TotalResult[]>(
                    "SELECT COALESCE(SUM(current_funding), 0) AS total FROM startup WHERE founder_id = ?",
                    [userId]
                );
                const money_raised = money_raised_rows[0].total;

                let userStats: StatsInterface = {
                    startups_created: startups_created,
                    startups_donated_to: startups_donated_to,
                    money_raised: money_raised,
                    total_donated: total_donated
                }

                return userStats

            } catch (error) {
                console.error("Error fetching user stats:", error);
                throw error;
            }
        },

        async sortUsersByTotalDonatedStartups(): Promise<LeaderboardUser[]> {
            try {
                const sql = `
                    SELECT u.id,
                           u.name,
                           u.profile_pic_path,
                           COUNT(DISTINCT d.startup_id) AS metric
                    FROM user u
                             LEFT JOIN
                         donation d ON u.id = d.donor_id
                    GROUP BY u.id, u.name, u.profile_pic_path
                    ORDER BY metric DESC
                `;

                const [rows] = await connection.promise().query<LeaderboardUser[]>(sql)
                return rows
            } catch (e) {
                if (e instanceof Error) {
                    throw e
                } else {
                    throw new Error("Unknown error when loading the leaderboard!")
                }
            }
        },

        async sortUsersByStartupsCreated(): Promise<LeaderboardUser[]> {
            try {
                const sql = `
                    SELECT u.id,
                           u.name,
                           u.profile_pic_path,
                           COUNT(s.id) AS metric
                    FROM user u
                             LEFT JOIN
                         startup s ON u.id = s.founder_id
                    GROUP BY u.id
                    ORDER BY metric DESC;
                `;
                const [rows] = await connection.promise().query<LeaderboardUser[]>(sql);
                return rows;
            } catch (error) {
                console.error("Error sorting users by startups created:", error);
                throw error;
            }
        },

        async sortUsersByMoneyRaised(): Promise<LeaderboardUser[]> {
            try {
                const sql = `
                    SELECT u.id,
                           u.name,
                           u.profile_pic_path,
                           COALESCE(SUM(s.current_funding), 0) AS metric
                    FROM user u
                             LEFT JOIN
                         startup s ON u.id = s.founder_id
                    GROUP BY u.id
                    ORDER BY metric DESC;
                `;
                const [rows] = await connection.promise().query<LeaderboardUser[]>(sql);
                return rows;
            } catch (error) {
                console.error("Error sorting users by money raised:", error);
                throw error;
            }
        },

        async sortUsersByTotalDonated(): Promise<LeaderboardUser[]> {
            try {
                const sql = `
                    SELECT u.id,
                           u.name,
                           u.profile_pic_path,
                           COALESCE(SUM(d.amount), 0) AS metric
                    FROM user u
                             LEFT JOIN
                         donation d ON u.id = d.donor_id
                    GROUP BY u.id
                    ORDER BY metric DESC;
                `;
                const [rows] = await connection.promise().query<LeaderboardUser[]>(sql);
                return rows;
            } catch (error) {
                console.error("Error sorting users by total donated:", error);
                throw error;
            }
        },


        async getUsersForLeaderboard(metric: string): Promise<LeaderboardUser[]> {
            try {

                switch (metric) {
                    case "creators":
                        return this.sortUsersByStartupsCreated();

                    case "supported":
                        return this.sortUsersByTotalDonatedStartups();

                    case "raised":
                        return this.sortUsersByMoneyRaised();

                    case "donated":
                        return this.sortUsersByTotalDonated();


                    default:
                        throw new Error(`Invalid leaderboard metric provided: "${metric}"`);
                }
            } catch (e) {

                console.error(`Error in getUsersForLeaderboard with metric "${metric}":`, e);
                throw e;
            }
        }
    }


export default statsService
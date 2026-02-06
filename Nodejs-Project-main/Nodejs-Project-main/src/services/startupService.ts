import connection from "../config/db_connection.ts";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import StartupUpdateInput from "../interfaces/startup-interfaces/startupUpdateInterface.ts";
import StartupCreateInput from "../interfaces/startup-interfaces/startupCreateInterface.ts";
import Startup from "../interfaces/startup-interfaces/startupInterface.ts";
import IStartupService from "../interfaces/startup-interfaces/startupServiceInterface.ts";
import tagService from "./tagService.js";

const startupService: IStartupService = {
    async getAllStartups(): Promise<Startup[]> {
        try {
            const [rows] = await connection.promise().query<Startup[]>("SELECT * FROM startup");
            return rows;
        } catch (e: unknown) {
            if (e instanceof Error) {
                throw e;
            }
            throw new Error("An unknown error occurred while fetching all startups.");
        }
    },

    async getAllStartupsForUser(userId: number): Promise<Startup[]> {
        try {
            const [rows] = await connection.promise().query<Startup[]>("SELECT * FROM startup WHERE founder_id = ?", [userId]);
            return rows;
        } catch (e: unknown) {
            if (e instanceof Error) {
                throw e;
            }
            throw new Error("An unknown error occurred while fetching startups for current user.")
        }
    },

    async createStartup(startupObject: StartupCreateInput, tags: string[]): Promise<Startup> {
        console.log(startupObject);
        const created_at: Date = new Date();

        try {

            const [result] = await connection.promise().query<ResultSetHeader>(
                "INSERT INTO startup(founder_id, name, description, funding_goal, created_at) VALUES(?, ?, ?, ?, ?)",
                [startupObject.founder_id, startupObject.name, startupObject.description, startupObject.funding_goal, created_at]
            );


            if (result.affectedRows === 0) {
                throw new Error("Startup creation failed, no rows affected.");
            }

            const newStartupId = result.insertId;


            const [rows] = await connection.promise().query<RowDataPacket[]>(
                "SELECT * FROM startup WHERE id = ?",
                [newStartupId]
            );


            if (rows.length === 0) {
                throw new Error("Could not find the newly created startup.");
            }


            if (tags && tags.length > 0) {
                await tagService.createTagStartup(newStartupId, tags);
            }

            return rows[0] as Startup;

        } catch (e: unknown) {
            if (e instanceof Error) {
                throw e;
            }

            throw new Error("An unknown error occurred while creating a startup.");
        }
    },

    async findStartupById(id: number): Promise<Startup> {
        try {
            const [rows] = await connection.promise().query<Startup[]>("SELECT * FROM startup WHERE id = ?", [id]);

            if (rows.length === 0) {
                throw new Error("Startup with given id does not exist!");
            }
            return rows[0];
        } catch (err: unknown) {
            if (err instanceof Error) {
                throw err;
            }
            throw new Error("An unknown error occurred while finding startup by ID.");
        }
    },

    async deleteStartupById(id: number): Promise<void> {
        try {

            await this.findStartupById(id);
            const [result] = await connection.promise().query<ResultSetHeader>("DELETE FROM startup WHERE id = ?", [id]);
            if (result.affectedRows === 0) {
                throw new Error("Failed to delete startup: Startup not found or no rows affected.");
            }
        } catch (e: unknown) {
            if (e instanceof Error) {
                throw e;
            }
            throw new Error("An unknown error occurred during startup deletion process.");
        }
    },

    async updateStartupById(id: number, startupObject: StartupUpdateInput): Promise<void> {
        try {
            await this.findStartupById(id);
        } catch (e: unknown) {
            if (e instanceof Error) {
                throw e;
            }
            throw new Error("An unknown error occurred during startup existence check for update.");
        }

        try {
            const updateFields: string[] = [];
            const updateValues: (string | number)[] = [];

            if (startupObject.name !== undefined) {
                updateFields.push("name = ?");
                updateValues.push(startupObject.name);
            }
            if (startupObject.description !== undefined) {
                updateFields.push("description = ?");
                updateValues.push(startupObject.description);
            }
            if (startupObject.funding_goal !== undefined) {
                updateFields.push("funding_goal = ?");
                updateValues.push(startupObject.funding_goal);
            }

            if (updateFields.length === 0) {
                console.warn(`No fields provided to update for startup ID: ${id}`);
                return;
            }

            const query = `UPDATE startup
                           SET ${updateFields.join(" , ")}
                           WHERE id = ?`;
            await connection.promise().query<ResultSetHeader>(query, [...updateValues, id]);

        } catch (e: unknown) {
            if (e instanceof Error) {
                throw e;
            }
            throw new Error("An unknown error occurred during startup update.");
        }
    },

    async getStartupsForShowcase(showcaseFilter: string): Promise<Startup[]> {

        try {
            switch (showcaseFilter) {
                case "most-donated":
                    let [rows1] = await connection.promise().query<Startup[]>("SELECT * FROM startup ORDER BY current_funding DESC LIMIT 10");
                    return rows1;
                case "recent":
                    let [rows2] = await connection.promise().query<Startup[]>("SELECT * FROM startup ORDER BY created_at DESC LIMIT 10");
                    return rows2;
            }

            return [];
        } catch (e) {
            if (e instanceof Error) {
                throw e
            } else {
                throw new Error("Unexpected server error when fetching the startups")
            }
        }

    },

    // async searchStartups(keywords: string): Promise<Startup[]> {
    //     const searchTerm = `%${keywords.toLowerCase()}%`;
    //     try {
    //         const [results] = await connection.promise().query<Startup[]>("SELECT * FROM startup WHERE  LOWER(CONCAT(name, ' ', description)) LIKE ?", [searchTerm])
    //         return results;
    //     } catch (e) {
    //         if (e instanceof Error) {
    //             throw e
    //         } else {
    //             throw new Error("Unknown error when searching startups!")
    //         }
    //     }
    // },
    //
    // async filterStartups(sortBy: string, categories: string): Promise<Startup[]> {
    //     let order;
    //     let sortByFilter;
    //     switch (sortBy) {
    //         case "newest":
    //             order = "ASC"
    //             sortByFilter = "created_at"
    //             break;
    //         case "oldest":
    //             order = "DESC"
    //             sortByFilter = "created_at"
    //             break;
    //         case "funding-asc":
    //             order = "ASC"
    //             sortByFilter = "current_funding"
    //             break;
    //         case "funding-desc":
    //             order = "DESC"
    //             sortByFilter = "current_funding"
    //             break;
    //         default:
    //             sortByFilter = "created_at";
    //             order = "DESC";
    //     }
    //
    //     let sql = "SELECT startup.* FROM startup"
    //     const params = [];
    //     const hashTagFilters = categories ? categories.split("-") : [];
    //
    //     if (hashTagFilters.length > 0) {
    //         sql += " JOIN startup_tags ON startup.id = startup_tags.startup_id\n" +
    //             "            JOIN tags ON startup_tags.tag_id = tags.id\n" +
    //             "            WHERE tags.name IN (?)"
    //
    //
    //         params.push(hashTagFilters);
    //
    //     }
    //
    //     sql += ` GROUP BY startup.id`;
    //
    //     sql += ` ORDER BY startup.${sortByFilter} ${order}`;
    //
    //     try {
    //         const [results] = await connection.promise().query<Startup[]>(sql, params)
    //         return results
    //     } catch (e) {
    //         if (e instanceof Error) {
    //             throw e
    //         } else {
    //             throw new Error("Unknown server error when filtering the startups!")
    //         }
    //     }
    // },


    async filterAndSearchStartups(sortBy?: string, categories?: string, searchQuery?: string): Promise<Startup[]> {
        let order = "DESC";
        let sortByFilter = "created_at";

        switch (sortBy) {
            case "oldest":
                sortByFilter = "created_at";
                order = "ASC";
                break;
            case "funding_asc":
                sortByFilter = "current_funding";
                order = "ASC";
                break;
            case "funding_desc":
                sortByFilter = "current_funding";
                order = "DESC";
                break;
        }

        let sql = `
            SELECT startup.*
            FROM startup
        `;
        const params: any[] = [];
        const whereClauses: string[] = [];

        const hashTagFilters = categories ? categories.split("-") : [];

        if (hashTagFilters.length > 0) {
            sql += `
            JOIN startup_tags ON startup.id = startup_tags.startup_id
            JOIN tags ON startup_tags.tag_id = tags.id
        `;
            whereClauses.push(`tags.name IN (?)`);
            params.push(hashTagFilters);
        }

        if (searchQuery) {
            whereClauses.push(`LOWER(CONCAT(startup.name, ' ', startup.description)) LIKE ?`);
            params.push(`%${searchQuery.toLowerCase()}%`);
        }

        if (whereClauses.length > 0) {
            sql += ` WHERE ${whereClauses.join(" AND ")}`;
        }

        sql += ` GROUP BY startup.id`;
        sql += ` ORDER BY startup.${sortByFilter} ${order}`;


        try {
            console.log("Executing SQL:", sql);
            console.log("With Params:", params);
            const [results] = await connection.promise().query(sql, params);
            return results as Startup[];
        } catch (error) {
            console.error("Error filtering/searching startups in service:", error);
            throw new Error("Failed to retrieve startups from the database.");
        }
    }
};


export default startupService
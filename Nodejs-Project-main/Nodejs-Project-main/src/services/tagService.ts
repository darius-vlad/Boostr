import connection from "../config/db_connection.js";
import Tag from "../interfaces/tag-interfaces/tagInterface.js";
import {ResultSetHeader} from "mysql2";

const tagService =
    {
        async createTagStartup(startupId: number, tags: string[]) {
            try {
                for (let tag of tags) {
                    let id;
                    let lowerTag = tag.toLowerCase();
                    const [rows] = await connection.promise().query<Tag[]>("SELECT * FROM tags WHERE name = ?", [lowerTag]);
                    if (rows.length == 0) {
                        const [newStartup] = await connection.promise().query<ResultSetHeader>("INSERT INTO tags(name) VALUES(?)", [lowerTag]);
                        id = newStartup.insertId;
                    } else {
                        id = rows[0].id
                    }

                    await connection.promise().query("INSERT INTO startup_tags(startup_id , tag_id) VALUES(?,?)", [startupId, id]);
                }
            } catch (e) {
                if (e instanceof Error)
                    throw e;
                else {
                    throw new Error("There was an unknown error creating the tags!")
                }
            }
        },

        async getTagForStartup(startupId: number) {
            const tags = [];
            try {
                const [tagIdsResults] = await connection.promise().query<any[]>("SELECT tag_id FROM startup_tags WHERE startup_id = ?", [startupId])
                console.log(tagIdsResults)
                for (let tagId of tagIdsResults) {
                    const [rows] = await connection.promise().query<any[]>("SELECT name FROM tags WHERE id = ?", [tagId.tag_id]);
                    if (rows && rows.length > 0) {
                        tags.push(rows[0].name);
                    }
                }
                console.log(tags)
                return tags;
            } catch (e) {
                if (e instanceof Error)
                    throw e;
                else {
                    throw new Error("There was an unknow error getting the tags!")
                }
            }
        }
    }

export default tagService
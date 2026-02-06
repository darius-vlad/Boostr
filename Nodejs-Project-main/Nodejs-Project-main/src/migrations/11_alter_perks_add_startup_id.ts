import connection from "../config/db_connection.ts";

const migration =
    {
        async up(): Promise<void> {
            try {
                await connection.promise().query("alter table perks\n" +
                    "    add startup_id bigint not null;");
            } catch (e) {
                throw e;
            }

        },

        async down(): Promise<void> {
            await connection.promise().query("DROP TABLE  startup_tags")
        }
    }


export default migration
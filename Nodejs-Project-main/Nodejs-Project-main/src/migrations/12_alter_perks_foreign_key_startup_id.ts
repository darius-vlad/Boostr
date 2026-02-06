import connection from "../config/db_connection.ts";

const migration =
    {
        async up(): Promise<void> {
            try {
                await connection.promise().query("alter table perks\n" +
                    "    add constraint perks_startup_id_fk\n" +
                    "        foreign key (startup_id) references startup (id);");
            } catch (e) {
                throw e;
            }

        },

        async down(): Promise<void> {
            await connection.promise().query("DROP TABLE  startup_tags")
        }
    }


export default migration
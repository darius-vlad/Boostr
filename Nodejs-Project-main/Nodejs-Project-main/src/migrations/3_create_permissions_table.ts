import connection from "../config/db_connection.ts";

const migration =
    {
        async up(): Promise<void> {
            try {
                await connection.promise().query("create table permissions\n" +
                    "(\n" +
                    "    id    bigint auto_increment\n" +
                    "        primary key,\n" +
                    "    `key` varchar(128) not null\n" +
                    ");\n")
            } catch (e) {
                throw e
            }

        },

        async down(): Promise<void> {
            await connection.promise().query("DROP TABLE  permissions")
        }
    }


export default migration
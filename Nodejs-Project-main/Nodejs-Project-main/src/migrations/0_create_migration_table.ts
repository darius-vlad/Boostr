import connection from "../config/db_connection.ts";

const migration =
    {

        async up(): Promise<void> {
            try {
                await connection.promise().query("create table migrations\n" +
                    "(\n" +
                    "    id          bigint\n" +
                    "        primary key,\n" +
                    "    description varchar(128) null,\n" +
                    "    timestamp   datetime     null\n" +
                    ");")
            } catch (e) {
                throw e
            }
        },

        async down(): Promise<void> {
            await connection.promise().query("DROP TABLE  migrations")
        }
    }

export default migration
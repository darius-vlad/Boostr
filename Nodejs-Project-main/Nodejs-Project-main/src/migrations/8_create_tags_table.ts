import connection from "../config/db_connection.ts";

const migration =
    {
        async up(): Promise<void> {

            try {
                await connection.promise().query("create table tags\n" +
                    "(\n" +
                    "    id   bigint auto_increment\n" +
                    "        primary key,\n" +
                    "    name varchar(64) not null\n" +
                    ");\n")
            } catch (e) {
                throw e
            }

        },

        async down(): Promise<void> {
            await connection.promise().query("DROP TABLE  tags")
        }
    }


export default migration
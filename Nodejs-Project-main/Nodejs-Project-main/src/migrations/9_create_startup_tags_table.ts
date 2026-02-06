import connection from "../config/db_connection.ts";

const migration =
    {
        async up(): Promise<void> {
            try {
                await connection.promise().query("create table startup_tags\n" +
                    "(\n" +
                    "    id         bigint auto_increment\n" +
                    "        primary key,\n" +
                    "    startup_id bigint not null,\n" +
                    "    tag_id     bigint not null,\n" +
                    "    constraint startup_tags_startup_id_fk\n" +
                    "        foreign key (startup_id) references startup (id),\n" +
                    "    constraint startup_tags_tags_id_fk\n" +
                    "        foreign key (tag_id) references tags (id)\n" +
                    ");\n")
            } catch (e) {
                throw e
            }

        },

        async down(): Promise<void> {
            await connection.promise().query("DROP TABLE  startup_tags")
        }
    }


export default migration
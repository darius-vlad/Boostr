import connection from "../config/db_connection.ts";

const migration =
    {
        async up(): Promise<void> {
            try {
                await connection.promise().query("create table startup\n" +
                    "(\n" +
                    "    id              bigint auto_increment\n" +
                    "        primary key,\n" +
                    "    founder_id      bigint           not null,\n" +
                    "    name            varchar(64)      not null,\n" +
                    "    description     varchar(1024)    null,\n" +
                    "    funding_goal    bigint           not null,\n" +
                    "    current_funding bigint default 0 null,\n" +
                    "    created_at      datetime         not null,\n" +
                    "    constraint startup_user_id_fk\n" +
                    "        foreign key (founder_id) references user (id)\n" +
                    ");\n")
            } catch (e) {
                throw e
            }

        },

        async down(): Promise<void> {
            await connection.promise().query("DROP TABLE  startup")
        }
    }


export default migration
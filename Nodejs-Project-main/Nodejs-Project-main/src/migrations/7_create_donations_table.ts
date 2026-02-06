import connection from "../config/db_connection.ts";

const migration =
    {
        async up(): Promise<void> {
            try {
                await connection.promise().query("create table donation\n" +
                    "(\n" +
                    "    id         bigint auto_increment\n" +
                    "        primary key,\n" +
                    "    startup_id bigint   not null,\n" +
                    "    donor_id   bigint   not null,\n" +
                    "    amount     bigint   not null,\n" +
                    "    donated_at datetime not null,\n" +
                    "    perk_id    bigint   null,\n" +
                    "    constraint donation_perks_id_fk\n" +
                    "        foreign key (perk_id) references perks (id),\n" +
                    "    constraint donation_startup_id_fk\n" +
                    "        foreign key (startup_id) references startup (id),\n" +
                    "    constraint donation_user_id_fk\n" +
                    "        foreign key (donor_id) references user (id)\n" +
                    ");\n")
            } catch (e) {
                throw e
            }

        },

        async down(): Promise<void> {
            await connection.promise().query("DROP TABLE  donation")
        }
    }


export default migration
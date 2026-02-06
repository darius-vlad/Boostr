import connection from "../config/db_connection.ts";

const migration =
    {
        async up(): Promise<void> {
            try {
                await connection.promise().query("create table roles_permissions\n" +
                    "(\n" +
                    "    id            bigint auto_increment\n" +
                    "        primary key,\n" +
                    "    role_id       bigint not null,\n" +
                    "    permission_id bigint not null,\n" +
                    "    constraint roles_permissions_permissions_id_fk\n" +
                    "        foreign key (permission_id) references permissions (id),\n" +
                    "    constraint roles_permissions_roles_id_fk\n" +
                    "        foreign key (role_id) references roles (id)\n" +
                    ");\n")
            } catch (e) {
                throw e
            }

        },

        async down(): Promise<void> {
            await connection.promise().query("DROP TABLE  roles_permissions")
        }
    }


export default migration
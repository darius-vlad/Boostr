import connection from "../config/db_connection.ts";

const migration =
    {
        async up(): Promise<void> {
            try {
                await connection.promise().query(`
                    CREATE TABLE user_stats
                    (
                        id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
                        user_id             BIGINT NULL,
                        startups_created    BIGINT DEFAULT 0 NOT NULL,
                        startups_donated_to BIGINT DEFAULT 0 NOT NULL,
                        money_raised        BIGINT DEFAULT 0 NOT NULL,
                        total_donated       BIGINT DEFAULT 0 NOT NULL,
                        CONSTRAINT table_name_user_id_fk FOREIGN KEY (user_id) REFERENCES user (id)
                    );
                `)
            } catch (e) {
                throw e
            }

        },

        async down(): Promise<void> {
            await connection.promise().query("DROP TABLE user_stats ")
        }
    }


export default migration
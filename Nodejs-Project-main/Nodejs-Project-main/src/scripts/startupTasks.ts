import migrationsScripts from "./migrationsScripts.ts";

export async function runStartupTasks() {


    await migrationsScripts.applyMigrations()

}
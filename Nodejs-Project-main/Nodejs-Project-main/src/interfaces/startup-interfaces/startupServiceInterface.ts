import Startup from "./startupInterface.ts";
import StartupCreateInput from "./startupCreateInterface.ts";
import StartupUpdateInput from "./startupUpdateInterface.ts";

interface IStartupService {
    getAllStartups(): Promise<Startup[]>;

    createStartup(startupObject: StartupCreateInput, tags: string[]): Promise<Startup>;

    findStartupById(id: number): Promise<Startup>;

    deleteStartupById(id: number): Promise<void>;

    updateStartupById(id: number, startupObject: StartupUpdateInput): Promise<void>;

    getAllStartupsForUser(id: number): Promise<Startup[]>;

    getStartupsForShowcase(showcaseFilter: string): Promise<Startup[]>;

    // searchStartups(keywords: string): Promise<Startup[]>;
    //
    // filterStartups(sortBy: string, categories: string): Promise<Startup[]>;

    filterAndSearchStartups(sortBy?: string, categories?: string, searchQuery?: string): Promise<Startup[]>
}

export default IStartupService
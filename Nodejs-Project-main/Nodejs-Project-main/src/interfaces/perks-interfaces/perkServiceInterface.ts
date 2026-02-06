import Perk from "./perkInterface.ts";
import PerkCreateInput from "./perkCreateInterface.ts";
import PerkUpdateInterface from "./perkUpdateInterface.ts";

interface IPerkService {
    getAllPerks(): Promise<Perk[]>;

    createPerk(startupId: number, perkObject: PerkCreateInput): Promise<void>;

    findPerkById(perkId: number): Promise<Perk>

    deletePerkById(perkId: number): Promise<void>

    updatePerkById(perkId: number, perkObject: PerkUpdateInterface): Promise<void>

    getPerksForStartup(startupId: number): Promise<Perk[]>
}

export default IPerkService;
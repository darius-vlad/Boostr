import Donation from "./donationInterface.ts";
import DonationCreateInterface from "./donationCreateInterface.ts";

interface DonationServiceInterface {
    getAllDonations(): Promise<Donation[]>;

    createDonation(donationObject: DonationCreateInterface): Promise<void>;

    findDonationById(donationId: number): Promise<Donation>

    deleteDonationByID(donationId: number): Promise<void>

}


export default DonationServiceInterface
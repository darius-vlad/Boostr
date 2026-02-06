interface DonationCreateInterface {
    startup_id: number;
    donor_id: number;
    amount: number;
    perk_id?: number
}

export default DonationCreateInterface;
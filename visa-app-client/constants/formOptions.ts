export const LEGAL_STATUS = [
    "Citizen",
    "Permanent resident",
    "Temporary visa holder",
    "Other",
] as const;

export const RELATIONSHIP_STATUS = [
    "Single",
    "Married",
    "De facto",
    "Divorced",
    "Widowed",
    "Separated",
] as const;

export const VISA_CATEGORIES = [
    {
        name: "482 - Skills In Demand",
        items: [
            "Nomination for a Skills in Demand Visa (482)",
            "Skills in Demand Visa (482)",
            "Skills in Demand Visa - Subsequent Entrant (482)",
        ],
    },
    {
        name: "Air & Sea Crew",
        items: ["Maritime Crew Visa (988)"],
    },
    {
        name: "APEC",
        items: ["APEC Business Travel Card"],
    },
    {
        name: "Citizenship",
        items: [
            "Australian citizenship by conferral",
            "Australian citizenship by descent",
            "Evidence of Australian citizenship",
        ],
    },
    {
        name: "Family",
        items: [
            "Sponsorship for a Family Member (870)",
            "Sponsorship for a Partner to Migrate to Australia (300,309/100,820/801)",
            "Stage 1 - Partner or Prospective Marriage Visa (300,309/100,820/801)",
            "Stage 2 - Permanent Partner Visa Assessment (100,801)",
            "Sponsored Parent (Temporary) Visa (870)",
        ],
    },
    {
        name: "Health",
        items: ["My Health Declarations"],
    },
    {
        name: "Refugee & Humanitarian",
        items: [
            "Offshore Humanitarian Proposal (200, 201, 202, 203, 204)",
            "Offshore Humanitarian Visa (200, 201, 202, 203, 204)",
            "Protection, Resolution of Status, Temporary Protection or Safe Haven Enterprise Visa (866, 851, 785, 790)",
        ],
    },
    {
        name: "Student",
        items: [
            "Student Guardian Visa (590)",
            "Student Visa (500)",
            "Student Visa (Subsequent Entrant) (500)",
        ],
    },
    {
        name: "Visitor",
        items: [
            "eVisitor (651)",
            "Visitor Visa (600)",
            "Transit Visa (771)",
            "Medical Treatment Visa (602)",
        ],
    },
    {
        name: "Working Holiday Maker",
        items: ["Work and Holiday Visa (462)", "Working Holiday Visa (417)"],
    },
] as const;

/** Subclass codes that have implemented application flows */
export const SUPPORTED_VISA_CODES = ["(771)", "(600)", "(500)"] as const;

export const isVisaSupported = (item: string): boolean =>
    SUPPORTED_VISA_CODES.some((code) => item.includes(code));

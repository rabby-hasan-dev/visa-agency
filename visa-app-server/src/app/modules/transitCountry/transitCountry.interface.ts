export type TTransitCountry = {
    name: string;         // e.g. "India"
    code: string;         // ISO-2 e.g. "IN"
    flagEmoji?: string;   // e.g. "🇮🇳"
    isActive: boolean;    // false = does NOT transit through Australia
    sortOrder: number;
    notes?: string;       // Admin-only notes / reason
    surcharge: number;    // Extra fee for this country
    currency?: string;    // Override currency (e.g. INR)
    exchangeRate?: number;// Convert from base (e.g. AUD to INR = 55.5)
    isDeleted: boolean;
};

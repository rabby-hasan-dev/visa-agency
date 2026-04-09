// ─── Transit Country ─────────────────────────────────────────────────────────

export interface TTransitCountry {
    _id: string;
    name: string;
    code: string;           // ISO-2 or ISO-3, uppercased
    flagEmoji?: string;
    isActive: boolean;      // true = transit through Australia is ALLOWED
    sortOrder: number;
    notes?: string;         // Admin-only note
    isDeleted: boolean;
    createdAt?: string;
    updatedAt?: string;
}
